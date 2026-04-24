import * as vscode from 'vscode';
import { AuthManager } from '../auth';
import { DeepSeekClient } from '../client';
import { logger } from '../logger';
import type {
	DeepSeekToolCall,
	ModelDefinition
} from '../types';
import { MODELS } from '../types';
import { type ReasoningEntry, pruneReasoningCache } from './cache';
import { convertMessages, convertTools, countMessageChars } from './convert';
import {
	createVisionModelGetter,
	resolveImageMessages,
	setVisionProxyModel,
} from './vision';

/**
 * DeepSeek Chat Provider — implements vscode.LanguageModelChatProvider so
 * DeepSeek V4 models appear directly in the Copilot Chat model picker.
 */
export class DeepSeekChatProvider implements vscode.LanguageModelChatProvider {
	private readonly authManager: AuthManager;

	/** reasoning text → tool_call IDs cache. */
	private readonly reasoningCache = new Map<string, ReasoningEntry>();

	/** Vision proxy: resolver + cached model. */
	private readonly vision = createVisionModelGetter();

	/**
	 * Adaptive chars-per-token ratio, calibrated from actual usage data.
	 * Updated via exponential moving average each time the API reports real token counts.
	 */
	private charsPerToken = 4.0;

	constructor(context: vscode.ExtensionContext) {
		this.authManager = new AuthManager(context);

		// Reset vision model cache when settings change
		context.subscriptions.push(
			vscode.workspace.onDidChangeConfiguration((e) => {
				if (
					e.affectsConfiguration('deepseek-copilot.visionModel') ||
					e.affectsConfiguration('deepseek-copilot.visionFallbackIds')
				) {
					this.vision.reset();
				}
			}),
		);
	}

	// ---- Public commands ----

	async configureApiKey(): Promise<void> {
		await this.authManager.promptForApiKey();
	}

	async clearApiKey(): Promise<void> {
		await this.authManager.deleteApiKey();
		vscode.window.showInformationMessage('DeepSeek API key removed.');
	}

	async hasApiKey(): Promise<boolean> {
		return this.authManager.hasApiKey();
	}

	/** See provider/vision.ts */
	async setVisionProxyModel(): Promise<void> {
		await setVisionProxyModel();
	}



	// ---- LanguageModelChatProvider ----

	async provideLanguageModelChatInformation(
		options: vscode.PrepareLanguageModelChatModelOptions,
		_token: vscode.CancellationToken,
	): Promise<vscode.LanguageModelChatInformation[]> {
		const hasKey = await this.authManager.hasApiKey();
		if (!hasKey) {
			if (options.silent) {
				return [];
			}
			const configured = await this.authManager.promptForApiKey();
			if (!configured) {
				return [];
			}
		}

		return MODELS.map(toChatInfo);
	}

	async provideLanguageModelChatResponse(
		modelInfo: vscode.LanguageModelChatInformation,
		messages: readonly vscode.LanguageModelChatRequestMessage[],
		options: vscode.ProvideLanguageModelChatResponseOptions,
		progress: vscode.Progress<vscode.LanguageModelResponsePart>,
		token: vscode.CancellationToken,
	): Promise<void> {
		const apiKey = await this.authManager.getApiKey();
		if (!apiKey) {
			throw new Error(
				'DeepSeek API key not configured. Run "DeepSeek: Set API Key" from the Command Palette.',
			);
		}

		const baseUrl = this.authManager.getBaseUrl();
		const client = new DeepSeekClient(baseUrl, apiKey);

		const modelDef = findModel(modelInfo.id);
		const isThinkingModel = modelDef?.capabilities.thinking ?? false;
		const thinkingEnabled = isThinkingModel && this.authManager.getThinkingEnabled();
		const thinkingEffort = this.authManager.getThinkingEffort();
		const maxTokens = this.authManager.getMaxTokens();

		// Heuristic: detect conversation start to clear stale cache.
		if (messages.length <= 2) {
			pruneReasoningCache(this.reasoningCache, true);
		}

		// Vision proxy: resolve images → text descriptions before sending to DeepSeek
		const resolvedMessages = await resolveImageMessages(
			messages,
			token,
			() => this.vision.get(),
		);
		const deepseekMessages = convertMessages(
			resolvedMessages,
			isThinkingModel,
			this.reasoningCache,
		);
		const tools = modelDef?.capabilities.toolCalling
			? convertTools(options.tools)
			: undefined;

		const totalRequestChars = countMessageChars(deepseekMessages);

		let accumulatedReasoning = '';
		const pendingToolCallIds: string[] = [];
		let responseMessageId: string | undefined;

		return new Promise<void>((resolve, reject) => {
			client.streamChatCompletion(
				{
					model: modelInfo.id,
					messages: deepseekMessages,
					stream: true,
					tools,
					tool_choice: tools && tools.length > 0 ? 'auto' : undefined,
					max_tokens: maxTokens,
					...(isThinkingModel
						? {
								thinking: { type: thinkingEnabled ? 'enabled' as const : 'disabled' as const },
								...(thinkingEnabled ? { reasoning_effort: thinkingEffort } : {}),
							}
						: {}),
				},
				{
					onContent: (content: string) => {
						progress.report(new vscode.LanguageModelTextPart(content));
					},

					onThinking: (text: string) => {
						accumulatedReasoning += text;

						// LanguageModelThinkingPart is a proposed API — the class
						// exists at runtime in both stable and Insiders, but the
						// stable vscode.d.ts doesn't include it. The .d.ts
						// augmentation in the project root provides type safety.
						progress.report(
							new vscode.LanguageModelThinkingPart(
								text,
							) as unknown as vscode.LanguageModelResponsePart,
						);
					},

					onToolCall: (toolCall: DeepSeekToolCall) => {
						pendingToolCallIds.push(toolCall.id);

						// Cache reasoning keyed by tool_call ID
						if (isThinkingModel && accumulatedReasoning) {
							this.reasoningCache.set(toolCall.id, {
								text: accumulatedReasoning,
								timestamp: Date.now(),
							});
						}

						try {
							const args = JSON.parse(toolCall.function.arguments);
							progress.report(
								new vscode.LanguageModelToolCallPart(
									toolCall.id,
									toolCall.function.name,
									args,
								),
							);
						} catch {
							progress.report(
								new vscode.LanguageModelToolCallPart(
									toolCall.id,
									toolCall.function.name,
									{},
								),
							);
						}
					},

					onError: (error: Error) => {
						reject(error);
					},

					onDone: () => {
						// Cache reasoning for the final response (non-tool-call case).
						if (
							isThinkingModel &&
							accumulatedReasoning &&
							pendingToolCallIds.length === 0
						) {
							responseMessageId = `resp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
							this.reasoningCache.set(responseMessageId, {
								text: accumulatedReasoning,
								timestamp: Date.now(),
							});
						}

						pruneReasoningCache(this.reasoningCache, false);
						resolve();
					},

					onUsage: (usage) => {
						// Calibrate chars-per-token ratio from real API usage data.
						if (totalRequestChars > 0 && usage.prompt_tokens > 0) {
							const observedRatio = totalRequestChars / usage.prompt_tokens;
							this.charsPerToken =
								this.charsPerToken * 0.7 + observedRatio * 0.3;
						}

						// Log KV cache hit stats for observability.
						const cacheHit = usage.prompt_cache_hit_tokens ?? 0;
						const cacheMiss = usage.prompt_cache_miss_tokens ?? 0;
						const cacheTotal = cacheHit + cacheMiss;
						const hitRate = cacheTotal > 0 ? ((cacheHit / cacheTotal) * 100).toFixed(0) : 'n/a';
						logger.info(
							`tokens: prompt=${usage.prompt_tokens} completion=${usage.completion_tokens}` +
							` | cache: hit=${cacheHit} miss=${cacheMiss} rate=${hitRate}%` +
							` | chars/tok=${this.charsPerToken.toFixed(2)}`,
						);
					},
				},
				token,
			);
		});
	}

	async provideTokenCount(
		_modelInfo: vscode.LanguageModelChatInformation,
		text: string | vscode.LanguageModelChatRequestMessage,
		_token: vscode.CancellationToken,
	): Promise<number> {
		if (typeof text === 'string') {
			return Math.max(1, Math.ceil(text.length / this.charsPerToken));
		}

		if (!text?.content || !Array.isArray(text.content)) {
			return 1;
		}

		let total = 0;
		for (const part of text.content) {
			if (part instanceof vscode.LanguageModelTextPart) {
				total += part.value.length;
			}
		}
		return Math.max(1, Math.ceil(total / this.charsPerToken));
	}
}

// ---- Helpers ----

function findModel(id: string): ModelDefinition | undefined {
	return MODELS.find((m) => m.id === id);
}

function toChatInfo(m: ModelDefinition): vscode.LanguageModelChatInformation {
	return {
		id: m.id,
		name: m.name,
		family: m.family,
		version: m.version,
		detail: m.detail,
		maxInputTokens: m.maxInputTokens,
		maxOutputTokens: m.maxOutputTokens,
		capabilities: {
			toolCalling: m.capabilities.toolCalling,
			imageInput: m.capabilities.imageInput,
		},
	};
}

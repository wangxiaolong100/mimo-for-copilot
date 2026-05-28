import { MIMO_TOOLS_LIMIT } from './provider/tools/consts';
import type { ModelDefinition } from './types';

/**
 * Compile-time constants shared across the extension.
 *
 * These do NOT depend on the VS Code runtime (no workspace configuration,
 * no secrets API). For run-time settings reads see `config.ts`.
 */

/** VS Code configuration section prefix for all extension settings. */
export const CONFIG_SECTION = 'mimo-copilot';

export const EXTERNAL_URLS = {
	mimo: {
		apiKeys: 'https://platform.xiaomimimo.com/#/console/api-keys',
		usage: 'https://platform.xiaomimimo.com/#/console/usage',
		status: 'https://platform.xiaomimimo.com',
	},
} as const;

/** URI path handled by this extension to reveal the output log. */
export const SHOW_LOGS_URI_PATH = '/showLogs';

/** URI path handled by this extension to open API key configuration. */
export const CONFIGURE_API_KEY_URI_PATH = '/setApiKey';

// VS Code's internal LanguageModelChatMessageRole.System is not exposed in @types/vscode.
export const LANGUAGE_MODEL_CHAT_SYSTEM_ROLE = 3;

// ---- Secret keys ----

/** SecretStorage key for the MiMo API key. */
export const API_KEY_SECRET = 'mimo-copilot.apiKey';

/** memento key tracking whether the welcome walkthrough has been shown. */
export const WELCOME_SHOWN_KEY = 'mimo-copilot.welcomeShown';

// ---- Walkthrough ----

/** Walkthrough contribution ID. */
export const WALKTHROUGH_ID = 'Vizards.mimo-for-copilot#mimoGettingStarted';

// ---- Model registry ----

/** Available MiMo models exposed through the language model provider. */
export const MODELS: ModelDefinition[] = [
	// Pro Series
	{
		id: 'mimo-v2.5-pro',
		name: 'MiMo V2.5 Pro',
		family: 'mimo',
		version: 'v2.5',
		detail: 'Most capable reasoning model',
		maxInputTokens: 1048576, // 1M context
		maxOutputTokens: 131072, // 128K output
		capabilities: {
			toolCalling: MIMO_TOOLS_LIMIT,
			imageInput: false,
			thinking: true,
		},
		requiresThinkingParam: true,
	},
	{
		id: 'mimo-v2-pro',
		name: 'MiMo V2 Pro',
		family: 'mimo',
		version: 'v2',
		detail: 'Pro model with reasoning capabilities',
		maxInputTokens: 1048576, // 1M context
		maxOutputTokens: 131072, // 128K output
		capabilities: {
			toolCalling: MIMO_TOOLS_LIMIT,
			imageInput: false,
			thinking: true,
		},
		requiresThinkingParam: true,
	},
	// Omni Series
	{
		id: 'mimo-v2.5',
		name: 'MiMo V2.5 Omni',
		family: 'mimo',
		version: 'v2.5',
		detail: 'Omni model with full multimodal understanding',
		maxInputTokens: 1048576, // 1M context
		maxOutputTokens: 131072, // 128K output
		capabilities: {
			toolCalling: MIMO_TOOLS_LIMIT,
			imageInput: true,
			thinking: true,
		},
		requiresThinkingParam: true,
	},
	{
		id: 'mimo-v2-omni',
		name: 'MiMo V2 Omni',
		family: 'mimo',
		version: 'v2',
		detail: 'Omni model with multimodal capabilities',
		maxInputTokens: 262144, // 256K context
		maxOutputTokens: 131072, // 128K output
		capabilities: {
			toolCalling: MIMO_TOOLS_LIMIT,
			imageInput: true,
			thinking: true,
		},
		requiresThinkingParam: true,
	},
	// Flash Series
	{
		id: 'mimo-v2-flash',
		name: 'MiMo V2 Flash',
		family: 'mimo',
		version: 'v2',
		detail: 'Fast, efficient model for quick tasks',
		maxInputTokens: 262144, // 256K context
		maxOutputTokens: 65536, // 64K output
		capabilities: {
			toolCalling: MIMO_TOOLS_LIMIT,
			imageInput: false,
			thinking: true,
		},
		requiresThinkingParam: true,
	},
];

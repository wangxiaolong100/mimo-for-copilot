import * as vscode from 'vscode';
import { logger } from './logger';
import { DeepSeekChatProvider } from './provider';

const WELCOME_SHOWN_KEY = 'deepseek-copilot.welcomeShown';

export function activate(context: vscode.ExtensionContext) {
	const provider = new DeepSeekChatProvider(context);

	context.subscriptions.push(
		vscode.lm.registerLanguageModelChatProvider('deepseek', provider),
		vscode.commands.registerCommand('deepseek-copilot.setApiKey', () =>
			provider.configureApiKey(),
		),
		vscode.commands.registerCommand('deepseek-copilot.clearApiKey', () =>
			provider.clearApiKey(),
		),
		vscode.commands.registerCommand('deepseek-copilot.setVisionModel', () =>
			provider.setVisionProxyModel(),
		),
		vscode.commands.registerCommand('deepseek-copilot.openSettings', () =>
			vscode.commands.executeCommand('workbench.action.openSettings', 'deepseek-copilot'),
		),
		vscode.commands.registerCommand('deepseek-copilot.showLogs', () => logger.show()),
	);

	void showWelcomeIfNeeded(context, provider);

	logger.info('Extension activated');
}

async function showWelcomeIfNeeded(
	context: vscode.ExtensionContext,
	provider: DeepSeekChatProvider,
): Promise<void> {
	if (context.globalState.get<boolean>(WELCOME_SHOWN_KEY)) {
		return;
	}
	if (await provider.hasApiKey()) {
		await context.globalState.update(WELCOME_SHOWN_KEY, true);
		return;
	}

	const setKey = 'Set API Key';
	const getKey = 'Get DeepSeek API Key';
	const later = 'Later';
	const choice = await vscode.window.showInformationMessage(
		'DeepSeek V4 for GitHub Copilot is installed. Set your DeepSeek API key to start using it in Copilot Chat.',
		setKey,
		getKey,
		later,
	);

	if (choice === setKey) {
		await provider.configureApiKey();
	} else if (choice === getKey) {
		await vscode.env.openExternal(vscode.Uri.parse('https://platform.deepseek.com/api_keys'));
	}

	await context.globalState.update(WELCOME_SHOWN_KEY, true);
}

export function deactivate() {
	logger.info('Extension deactivated');
	logger.dispose();
}

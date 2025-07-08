import * as vscode from 'vscode';
import { askAllCommand } from './comands/askAll';
import { BattleViewProvider } from './views/battle';

export function activate(context: vscode.ExtensionContext) {

    const provider = new BattleViewProvider(context.extensionUri);

    let votes: { [key: string]: number } = {
        gemini: 0,
        claude: 0,
        openai: 0,
    };

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(BattleViewProvider.viewType, provider));

    provider.onDidReceiveMessage(message => {
        switch (message.command) {
            case 'vote':
                if (message.vote === 'up') {
                    votes[message.provider]++;
                } else if (message.vote === 'down') {
                    votes[message.provider]--;
                }
                provider.postMessageToWebview({ command: 'updateVotes', provider: message.provider, votes: votes[message.provider] });
                return;
            case 'compareDiff':
                provider.openDiff(message.provider, message.aiResponse);
                return;
        }
    });

    const askAll = vscode.commands.registerCommand('aicodebattle.askAll', () => {
        // Reset votes on new battle
        votes = { gemini: 0, claude: 0, openai: 0 };
        provider.postMessageToWebview({ command: 'updateVotes', provider: 'gemini', votes: 0 });
        provider.postMessageToWebview({ command: 'updateVotes', provider: 'claude', votes: 0 });
        provider.postMessageToWebview({ command: 'updateVotes', provider: 'openai', votes: 0 });

        askAllCommand(context, provider);
    });

    context.subscriptions.push(askAll);
}
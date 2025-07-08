import * as vscode from 'vscode';
import { askAllCommand } from './comands/askAll';
import { BattleViewProvider } from './views/battle';

export function activate(context: vscode.ExtensionContext) {

    const provider = new BattleViewProvider(context.extensionUri);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(BattleViewProvider.viewType, provider));

    const askAll = vscode.commands.registerCommand('aicodebattle.askAll', () => {
        askAllCommand(context, provider);
    });

    context.subscriptions.push(askAll);
}
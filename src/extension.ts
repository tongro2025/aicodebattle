import * as vscode from 'vscode';
import { askAllCommand } from './comands/askAll';

export function activate(context: vscode.ExtensionContext) {
        const askAll = vscode.commands.registerCommand('aicodebattle.askAll', () => {
        askAllCommand(context);
    });

    context.subscriptions.push(askAll);
}

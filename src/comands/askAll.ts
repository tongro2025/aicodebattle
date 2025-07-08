
import * as vscode from 'vscode';
import { askGemini } from '../providers/gemini';
import { askClaude } from '../providers/claude';
import { askOpenAI } from '../providers/openai';
import { createBattleWebview } from '../views/battle';

export async function askAllCommand(context: vscode.ExtensionContext) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const selection = editor.document.getText(editor.selection);
    const question = await vscode.window.showInputBox({ prompt: '무엇을 물어볼까요?' });

    if (!question) {
        return;
    }

    const panel = createBattleWebview(context);

    // Gemini
    const geminiStream = await askGemini(question, selection);
    if (geminiStream) {
        for await (const chunk of geminiStream) {
            const chunkText = chunk.text();
            panel.webview.postMessage({ command: 'updateResponse', provider: 'gemini', text: chunkText });
        }
    }

    // Claude
    const claudeStream = await askClaude(question, selection);
    if (claudeStream) {
        for await (const event of claudeStream) {
            if (event.type === 'content_block_delta') {
                const chunkText = event.delta.text;
                panel.webview.postMessage({ command: 'updateResponse', provider: 'claude', text: chunkText });
            }
        }
    }

    // OpenAI
    const openaiStream = await askOpenAI(question, selection);
    if (openaiStream) {
        for await (const chunk of openaiStream) {
            const chunkText = chunk.choices[0]?.delta?.content || "";
            panel.webview.postMessage({ command: 'updateResponse', provider: 'openai', text: chunkText });
        }
    }
}

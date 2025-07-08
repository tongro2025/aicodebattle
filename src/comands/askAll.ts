
import * as vscode from 'vscode';
import { askGemini } from '../providers/gemini';
import { askClaude } from '../providers/claude';
import { askOpenAI } from '../providers/openai';
import { BattleViewProvider } from "../views/battle";

export async function askAllCommand(context: vscode.ExtensionContext, provider: BattleViewProvider) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const selection = editor.document.getText(editor.selection);
    const question = await vscode.window.showInputBox({ prompt: '무엇을 물어볼까요?' });

    if (!question) {
        return;
    }

    const processStream = async (provider: 'gemini' | 'claude' | 'openai') => {
        const stream = provider === 'gemini' ? await askGemini(question, selection)
            : provider === 'claude' ? await askClaude(question, selection)
            : await askOpenAI(question, selection);

        if (!stream) {return;}

        try {
            for await (const chunk of stream) {
                let chunkText = '';
                if (provider === 'gemini') {
                    chunkText = (chunk as GenerateContentResponse).text();
                } else if (provider === 'claude') {
                    const claudeChunk = chunk as MessageStreamEvent;
                    if (claudeChunk.type === 'content_block_delta') {
                        chunkText = claudeChunk.delta.text || '';
                    }
                } else if (provider === 'openai') {
                    chunkText = (chunk as ChatCompletionChunk).choices[0]?.delta?.content || '';
                }

                if (chunkText) {
                    provider.updateResponse(provider, chunkText);
                }
            }
        } catch (error) {
            console.error(`${provider} stream processing error:`, error);
            provider.updateResponse(provider, `Error: ${error.message}`);
        }
    };

    await Promise.all([
        processStream('gemini'),
        processStream('claude'),
        processStream('openai')
    ]);
}

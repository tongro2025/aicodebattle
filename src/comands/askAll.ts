import * as vscode from 'vscode';
import { askGemini } from '../providers/gemini';
import { askClaude } from '../providers/claude';
import { askOpenAI } from '../providers/openai';
import { BattleViewProvider } from "../views/battle";
import { MessageStreamEvent } from "@anthropic-ai/sdk/resources/messages";
import { ChatCompletionChunk } from "openai/resources/chat/completions";
import { GenerateContentResponse } from "@google/generative-ai";

export async function askAllCommand(context: vscode.ExtensionContext, provider: BattleViewProvider) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const selection = editor.document.getText(editor.selection);
    provider.setOriginalSelection(selection);
    const question = await vscode.window.showInputBox({ prompt: '무엇을 물어볼까요?' });

    if (!question) {
        return;
    }

    const processStream = async (providerId: 'gemini' | 'claude' | 'openai') => {
        const stream = providerId === 'gemini' ? await askGemini(question, selection)
            : providerId === 'claude' ? await askClaude(question, selection)
            : await askOpenAI(question, selection);

        if (!stream) {return;}

        try {
            for await (const chunk of stream) {
                let chunkText = '';
                if (providerId === 'gemini') {
                    chunkText = (chunk as GenerateContentResponse).candidates?.[0]?.content?.parts?.[0]?.text ?? '';
                } else if (providerId === 'claude') {
                    const claudeChunk = chunk as MessageStreamEvent;
                    if (claudeChunk.type === 'content_block_delta') {
                        // Use 'text' if it exists, otherwise fallback to 'value' or stringify the delta for debugging
                        chunkText = (claudeChunk.delta as any).text ?? (claudeChunk.delta as any).value ?? '';
                    }
                } else if (providerId === 'openai') {
                    chunkText = (chunk as ChatCompletionChunk).choices[0]?.delta?.content || '';
                }

                if (chunkText) {
                    provider.updateResponse(providerId, chunkText);
                }
            }
        } catch (error: any) {
            console.error(`${providerId} stream processing error:`, error);
            provider.updateResponse(providerId, `Error: ${error.message}`);
        }
    };

    await Promise.all([
        processStream('gemini'),
        processStream('claude'),
        processStream('openai')
    ]);

    provider.postMessageToWebview({ command: 'streamsComplete' });
}
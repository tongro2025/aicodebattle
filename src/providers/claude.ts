
import Anthropic from "@anthropic-ai/sdk";
import * as vscode from 'vscode';

export async function askClaude(prompt: string, selection: string) {
    const anthropic = new Anthropic({
        apiKey: vscode.workspace.getConfiguration('aicodebattle').get('claude.apiKey') || ''
    });

    const fullPrompt = `${prompt}\n\n\`\`\`\n${selection}\n\`\`\``;

    try {
        const stream = await anthropic.messages.stream({
            model: "claude-3-opus-20240229",
            messages: [{ role: "user", content: fullPrompt }],
            max_tokens: 1024
        });
        return stream;
    } catch (error) {
        console.error(error);
        vscode.window.showErrorMessage('Claude API 요청 중 오류가 발생했습니다.');
        return null;
    }
}

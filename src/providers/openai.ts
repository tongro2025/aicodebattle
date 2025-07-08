
import OpenAI from "openai";
import * as vscode from 'vscode';

export async function askOpenAI(prompt: string, selection: string) {
    const openai = new OpenAI({
        apiKey: vscode.workspace.getConfiguration('aicodebattle').get('openai.apiKey') || ''
    });

    const fullPrompt = `${prompt}\n\n\`\`\`\n${selection}\n\`\`\``;

    try {
        const stream = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: fullPrompt }],
            stream: true,
        });
        return stream;
    } catch (error) {
        console.error(error);
        vscode.window.showErrorMessage('OpenAI API 요청 중 오류가 발생했습니다.');
        return null;
    }
}

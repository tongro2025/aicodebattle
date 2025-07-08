
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as vscode from 'vscode';

export async function askGemini(prompt: string, selection: string) {
    const genAI = new GoogleGenerativeAI(vscode.workspace.getConfiguration('aicodebattle').get('gemini.apiKey') || '');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    const fullPrompt = `${prompt}\n\n\`\`\`\n${selection}\n\`\`\``;

    try {
        const result = await model.generateContentStream(fullPrompt);
        return result.stream;
    } catch (error) {
        console.error(error);
        vscode.window.showErrorMessage('Gemini API 요청 중 오류가 발생했습니다.');
        return null;
    }
}

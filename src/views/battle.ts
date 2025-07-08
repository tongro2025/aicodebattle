
import * as vscode from 'vscode';

export function createBattleWebview(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        'aiCodeBattle',
        'AI Code Battle',
        vscode.ViewColumn.Beside,
        {
            enableScripts: true
        }
    );

    panel.webview.html = getWebviewContent();

    return panel;
}

function getWebviewContent() {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Code Battle</title>
        <style>
            body {
                display: flex;
                height: 100vh;
                margin: 0;
            }
            .container {
                display: flex;
                flex-direction: row;
                width: 100%;
            }
            .column {
                flex: 1;
                padding: 1em;
                border-left: 1px solid #ccc;
                overflow-y: auto;
            }
            .column:first-child {
                border-left: none;
            }
            h2 {
                position: sticky;
                top: 0;
                background: var(--vscode-editor-background);
                padding: 0.5em 0;
                margin-top: 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div id="gemini-column" class="column">
                <h2>Gemini</h2>
                <div id="gemini-response"></div>
            </div>
            <div id="claude-column" class="column">
                <h2>Claude</h2>
                <div id="claude-response"></div>
            </div>
            <div id="openai-column" class="column">
                <h2>OpenAI</h2>
                <div id="openai-response"></div>
            </div>
        </div>
        <script>
            const vscode = acquireVsCodeApi();
            const geminiResponse = document.getElementById('gemini-response');
            const claudeResponse = document.getElementById('claude-response');
            const openaiResponse = document.getElementById('openai-response');

            window.addEventListener('message', event => {
                const message = event.data;
                switch (message.command) {
                    case 'updateResponse':
                        if (message.provider === 'gemini') {
                            geminiResponse.innerHTML += message.text;
                        } else if (message.provider === 'claude') {
                            claudeResponse.innerHTML += message.text;
                        } else if (message.provider === 'openai') {
                            openaiResponse.innerHTML += message.text;
                        }
                        break;
                }
            });
        </script>
    </body>
    </html>`;
}

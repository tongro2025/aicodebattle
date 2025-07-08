import * as vscode from 'vscode';

export class BattleViewProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'aiCodeBattle.battleView';

    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    }

    public updateResponse(provider: string, text: string) {
        if (this._view) {
            this._view.webview.postMessage({ command: 'updateResponse', provider, text });
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // ... (getWebviewContent와 동일한 내용) ...
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
                    flex-direction: column; /* 세로 방향으로 변경 */
                    width: 100%;
                }
                .column {
                    flex: 1;
                    padding: 1em;
                    border-bottom: 1px solid #ccc; /* 아래쪽 테두리로 변경 */
                    overflow-y: auto;
                }
                .column:last-child {
                    border-bottom: none;
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
}
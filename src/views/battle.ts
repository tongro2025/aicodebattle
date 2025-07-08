import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';

export class BattleViewProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'aiCodeBattle.battleView';

    private _view?: vscode.WebviewView;
    private _originalSelection: string = '';
    private _onDidReceiveMessage = new vscode.EventEmitter<any>();
    public readonly onDidReceiveMessage = this._onDidReceiveMessage.event;

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

        webviewView.webview.onDidReceiveMessage(message => {
            this._onDidReceiveMessage.fire(message);
        });

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    }

    public setOriginalSelection(selection: string) {
        this._originalSelection = selection;
    }

    public postMessageToWebview(message: any) {
        if (this._view) {
            this._view.webview.postMessage(message);
        }
    }

    public updateResponse(provider: string, text: string) {
        if (this._view) {
            this._view.webview.postMessage({ command: 'updateResponse', provider, text });
        }
    }

    public async openDiff(provider: string, aiResponse: string) {
        const originalUri = vscode.Uri.file(path.join(os.tmpdir(), `original_selection_${Date.now()}.txt`));
        const aiResponseUri = vscode.Uri.file(path.join(os.tmpdir(), `${provider}_response_${Date.now()}.txt`));

        try {
            await vscode.workspace.fs.writeFile(originalUri, Buffer.from(this._originalSelection));
            await vscode.workspace.fs.writeFile(aiResponseUri, Buffer.from(aiResponse));

            vscode.commands.executeCommand(
                'vscode.diff',
                originalUri,
                aiResponseUri,
                `Original vs ${provider} Response`
            );
        } catch (err: any) {
            vscode.window.showErrorMessage(`Failed to open diff: ${err.message}`);
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
                    <button class="compare-button" data-provider="gemini" style="display:none;">Compare with Selection</button>
                    <div class="vote-buttons" style="display:none;">
                        <button class="vote-button" data-provider="gemini" data-vote="up">👍</button>
                        <span id="gemini-votes">0</span>
                        <button class="vote-button" data-provider="gemini" data-vote="down">👎</button>
                    </div>
                </div>
                <div id="claude-column" class="column">
                    <h2>Claude</h2>
                    <div id="claude-response"></div>
                    <button class="compare-button" data-provider="claude" style="display:none;">Compare with Selection</button>
                    <div class="vote-buttons" style="display:none;">
                        <button class="vote-button" data-provider="claude" data-vote="up">👍</button>
                        <span id="claude-votes">0</span>
                        <button class="vote-button" data-provider="claude" data-vote="down">👎</button>
                    </div>
                </div>
                <div id="openai-column" class="column">
                    <h2>OpenAI</h2>
                    <div id="openai-response"></div>
                    <button class="compare-button" data-provider="openai" style="display:none;">Compare with Selection</button>
                    <div class="vote-buttons" style="display:none;">
                        <button class="vote-button" data-provider="openai" data-vote="up">👍</button>
                        <span id="openai-votes">0</span>
                        <button class="vote-button" data-provider="openai" data-vote="down">👎</button>
                    </div>
                </div>
            </div>
            <script>
                const vscode = acquireVsCodeApi();
                const geminiResponse = document.getElementById('gemini-response');
                const claudeResponse = document.getElementById('claude-response');
                const openaiResponse = document.getElementById('openai-response');

                const geminiVotesSpan = document.getElementById('gemini-votes');
                const claudeVotesSpan = document.getElementById('claude-votes');
                const openaiVotesSpan = document.getElementById('openai-votes');

                let geminiFullResponse = '';
                let claudeFullResponse = '';
                let openaiFullResponse = '';

                window.addEventListener('message', event => {
                    const message = event.data;
                    switch (message.command) {
                        case 'updateResponse':
                            if (message.provider === 'gemini') {
                                geminiResponse.innerHTML += message.text;
                                geminiFullResponse += message.text;
                            } else if (message.provider === 'claude') {
                                claudeResponse.innerHTML += message.text;
                                claudeFullResponse += message.text;
                            } else if (message.provider === 'openai') {
                                openaiResponse.innerHTML += message.text;
                                openaiFullResponse += message.text;
                            }
                            break;
                        case 'streamsComplete':
                            document.querySelectorAll('.compare-button').forEach(button => {
                                button.style.display = 'block';
                            });
                            document.querySelectorAll('.vote-buttons').forEach(div => {
                                div.style.display = 'block';
                            });
                            break;
                        case 'updateVotes':
                            if (message.provider === 'gemini') {
                                geminiVotesSpan.textContent = message.votes;
                            } else if (message.provider === 'claude') {
                                claudeVotesSpan.textContent = message.votes;
                            } else if (message.provider === 'openai') {
                                openaiVotesSpan.textContent = message.votes;
                            }
                            break;
                    }
                });

                document.querySelectorAll('.compare-button').forEach(button => {
                    button.addEventListener('click', () => {
                        const provider = button.dataset.provider;
                        let aiResponse = '';
                        if (provider === 'gemini') {
                            aiResponse = geminiFullResponse;
                        } else if (provider === 'claude') {
                            aiResponse = claudeFullResponse;
                        } else if (provider === 'openai') {
                            aiResponse = openaiFullResponse;
                        }
                                        vscode.postMessage({ command: 'compareDiff', provider, aiResponse });
                                    });
                                });
                            </script>
                        </body>
                        </html>
                                                `;
                            }
                        }
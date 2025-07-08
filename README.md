# AI Code Battle

AI Code Battle은 Visual Studio Code 확장으로, 여러 AI 모델(Gemini, Claude, OpenAI)의 코드 생성 및 수정 능력을 비교하고, 가장 적합한 응답을 선택하여 코드에 적용할 수 있도록 돕습니다.

## 기능

- **다중 AI 응답 비교**: 선택한 코드 또는 질문에 대해 Gemini, Claude, OpenAI의 응답을 동시에 받아 나란히 비교할 수 있습니다.
- **실시간 스트리밍**: AI 응답이 실시간으로 스트리밍되어 표시되므로, 응답이 생성되는 과정을 즉시 확인할 수 있습니다.
- **코드 병합**: AI가 생성하거나 수정한 코드를 현재 편집기의 선택 영역에 쉽게 병합할 수 있습니다.
- **투표 기능**: 각 AI 응답에 대해 투표하여 어떤 AI가 더 나은 성능을 보였는지 기록할 수 있습니다.
- **원본 코드 비교**: AI 응답과 원본 선택 코드를 나란히 비교하여 변경 사항을 명확하게 확인할 수 있습니다.

## 설치

1. Visual Studio Code를 엽니다.
2. `Extensions` 뷰 (Ctrl+Shift+X 또는 Cmd+Shift+X)로 이동합니다.
3. 검색창에 `AI Code Battle`을 입력하고 검색합니다.
4. 확장을 찾아 `Install` 버튼을 클릭합니다.

또는, 이 저장소를 클론하여 로컬에서 빌드할 수 있습니다:

```bash
git clone https://github.com/your-username/aicodebattle.git
cd aicodebattle
npm install
npm run compile
```

## 사용법

1. VS Code에서 코드를 선택하거나, 특정 질문을 하고 싶은 경우 아무것도 선택하지 않은 상태에서 명령 팔레트(Ctrl+Shift+P 또는 Cmd+Shift+P)를 엽니다.
2. `AI Code Battle: Ask All AI` 명령을 실행합니다.
3. 질문 입력창이 나타나면 AI에게 물어볼 내용을 입력합니다.
4. Webview 패널에 Gemini, Claude, OpenAI의 응답이 실시간으로 표시됩니다.
5. 각 AI 응답 하단에 있는 `Compare with Selection` 버튼을 클릭하여 원본 코드와 AI 응답 간의 차이점을 비교할 수 있습니다.
6. `👍` 또는 `👎` 버튼을 클릭하여 각 AI 응답에 투표할 수 있습니다.
7. 가장 마음에 드는 AI 응답을 선택한 후, 해당 응답을 현재 편집기에 병합하는 기능은 추후 추가될 예정입니다.

## 설정

AI 모델을 사용하려면 해당 서비스의 API 키를 설정해야 합니다. VS Code 설정(File > Preferences > Settings 또는 Code > Preferences > Settings)에서 다음 설정을 검색하여 API 키를 입력합니다.

- `aicodebattle.geminiApiKey`: Gemini API 키
- `aicodebattle.claudeApiKey`: Claude API 키
- `aicodebattle.openaiApiKey`: OpenAI API 키

## 기여

버그 보고, 기능 제안 또는 코드 기여는 언제든지 환영합니다. GitHub 저장소에 이슈를 열거나 Pull Request를 제출해주세요.

## 라이선스

이 프로젝트는 [MIT License](LICENSE)에 따라 라이선스가 부여됩니다.

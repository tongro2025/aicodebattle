# AI Code Battle

AI Code Battle은 Visual Studio Code 확장 프로그램으로, 사용자가 선택한 코드와 질문을 바탕으로 여러 AI 모델(Gemini, Claude, OpenAI)의 응답을 동시에 비교하고 평가할 수 있는 기능을 제공합니다.

## 기능

- **다중 AI 모델 지원**: Gemini, Claude, OpenAI 모델에 동시에 질문을 보내 응답을 받습니다.
- **실시간 스트리밍**: 각 AI 모델의 응답이 실시간으로 스트리밍되어 표시됩니다.
- **사이드바 UI**: AI 응답이 VS Code 사이드바에 표시되어 코드 작업과 동시에 결과를 확인할 수 있습니다.
- **Diff 비교**: AI가 제안한 코드 변경 사항을 원본 코드와 Diff 형식으로 비교하여 시각적으로 쉽게 차이점을 파악할 수 있습니다.
- **투표 기능**: 각 AI 모델의 응답에 대해 투표(좋아요/싫어요)하여 어떤 응답이 더 유용한지 평가할 수 있습니다.

## 설치 및 사용법

1.  **확장 프로그램 설치**: (개발 중이므로, VS Code Marketplace에 게시되기 전까지는 소스 코드를 직접 빌드하여 사용해야 합니다.)

    *   이 저장소를 클론합니다.
    *   VS Code에서 프로젝트를 엽니다.
    *   터미널에서 `npm install`을 실행하여 의존성을 설치합니다.
    *   `F5` 키를 눌러 확장 프로그램 개발 호스트를 시작합니다.

2.  **API 키 설정**: 각 AI 모델의 API 키를 VS Code 설정(`settings.json`)에 추가해야 합니다.

    ```json
    {
        "aicodebattle.gemini.apiKey": "YOUR_GEMINI_API_KEY",
        "aicodebattle.claude.apiKey": "YOUR_CLAUDE_API_KEY",
        "aicodebattle.openai.apiKey": "YOUR_OPENAI_API_KEY"
    }
    ```

3.  **AI Code Battle 실행**:

    *   VS Code에서 코드를 작성하거나 엽니다.
    *   AI에게 질문의 맥락으로 제공하고 싶은 코드 블록을 선택합니다.
    *   `Ctrl+Shift+P` (Windows/Linux) 또는 `Cmd+Shift+P` (macOS)를 눌러 명령어 팔레트를 엽니다.
    *   `AI Code Battle: Ask All`을 입력하고 `Enter` 키를 누릅니다.
    *   상단에 나타나는 입력창에 AI에게 하고 싶은 질문을 입력하고 `Enter` 키를 누릅니다.

4.  **결과 확인**: AI 모델들의 응답이 VS Code 사이드바의 "AI Code Battle" 뷰에 실시간으로 표시됩니다.

    *   각 AI 응답 아래에 있는 "Compare with Selection" 버튼을 클릭하여 원본 코드와 AI 응답 간의 Diff를 확인할 수 있습니다.
    *   👍 / 👎 버튼을 클릭하여 각 AI 응답에 투표할 수 있습니다.

## 개발

-   **의존성 설치**: `npm install`
-   **빌드**: `npm run compile`
-   **실행/디버그**: `F5`
-   **테스트**: `npm test`
-   **린트**: `npm run lint`

## 기여

기여를 환영합니다! 버그 보고, 기능 제안, 풀 리퀘스트 등 언제든지 환영합니다.

## 라이선스

이 프로젝트는 [MIT License](LICENSE)를 따릅니다.
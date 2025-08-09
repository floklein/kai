## AI client for Chrome‑integrated Gemini Nano

A minimal client that runs prompts against Gemini Nano via Chrome's Prompt API.

### Gemini Nano setup (most important)

- **Supported platforms**: Windows 10/11, macOS 13+, or Linux (desktop Chrome only; not Android/iOS/ChromeOS).
- **Storage**: ≈ 22 GB free on the Chrome profile volume for the model.
- **GPU**: > 4 GB VRAM recommended.
- **Network**: Unmetered connection for first download.

1. In Chrome, open `chrome://flags` and enable:
   - `#prompt-api-for-gemini-nano`
   - `#optimization-guide-on-device-model` ("Enabled" or "Enabled BypassPerfRequirement")
     Then relaunch Chrome.

2. Open `chrome://components`, find "Optimization Guide On Device Model", click "Check for update" and wait for the model to download.

3. Verify model status in `chrome://on-device-internals` (Model status + File path).

See the official Prompt API docs: [Chrome Extensions — Prompt API](https://developer.chrome.com/docs/extensions/ai/prompt-api).

### Develop

- **Install**: `npm i`
- **Run**: `npm run dev`

### Troubleshooting

- Ensure desktop Chrome is up to date and meets the hardware/storage requirements above.
- Leave Chrome running during first download; large initial download may take time.
- Check `chrome://on-device-internals` for model status and file location.

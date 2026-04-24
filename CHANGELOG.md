# Changelog

## 0.1.0

- Initial release
- **DeepSeek V4 Pro & Flash** available in the GitHub Copilot Chat model picker
- **Thinking mode** with `reasoning_content` multi-turn caching
- **Reasoning effort** control (`high` / `max`)
- **Vision proxy** — route image attachments through any other installed Copilot Chat model
- **Tool calling** — full agent-mode support (file edits, terminal, search, Git, tests, MCP, skills)
- **Prompt cache stats** logged to output channel (hit / miss / rate)
- **BYOK** — API key stored in VS Code `SecretStorage` (OS keychain)
- Configurable `baseUrl`, `maxTokens`, `visionModel`, `visionPrompt`
- First-run welcome message to guide API key setup

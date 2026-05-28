<h1 align="center">MiMo for Copilot Chat</h1>

<p align="center">
  <!-- marketplace-readme:remove-start -->
  <a href="https://marketplace.visualstudio.com/items?itemName=Vizards.mimo-for-copilot"><img src="https://img.shields.io/badge/VS%20Code%20Marketplace-Install-007ACC?logo=visualstudiocode&logoColor=white&style=for-the-badge" alt="Install from VS Code Marketplace"></a>
  <a href="https://open-vsx.org/extension/Vizards/mimo-for-copilot"><img src="https://img.shields.io/badge/Open%20VSX-Install-6A4FB6?style=for-the-badge" alt="Install from Open VSX"></a>
  <br/>
  <!-- marketplace-readme:remove-end -->
  <img src="https://img.shields.io/github/v/release/Vizards/mimo-for-copilot?style=for-the-badge&label=Version" alt="Version" />
  <img src="https://vsmarketplacebadges.dev/installs-short/Vizards.mimo-for-copilot.svg?style=for-the-badge" alt="Installs" />
</p>

<p align="center">
  English |
  <a href="https://github.com/Vizards/mimo-for-copilot/blob/main/README.zh-cn.md">简体中文</a>
</p>

**Pick MiMo from the Copilot Chat model picker — and keep everything else Copilot already gives you.**

<p align="center">
  <img src="resources/screenshots/01-picker.png" alt="MiMo models in the Copilot Chat model picker, with the per-model Thinking Effort dropdown (None / High / Max)" width="800">
</p>

Love MiMo's price-performance but don't want to give up GitHub Copilot's agent mode, tool calling, and polished UI? This extension drops **MiMo Pro, Omni & Flash** straight into the Copilot Chat model selector — with **thinking mode** and your own API key.

## Why this extension?

- **Don't replace Copilot — power it up.** No new sidebar, no new chat UI to learn. Just a new model in the picker you already use.
- **Agent mode, tool calling, instructions, MCP, skills — all of it still works.** Copilot's entire stack, now running on MiMo.
- **BYOK, pay MiMo directly.** Your API key, your bill, your rate limits. Stored in the OS keychain, never on disk.

## Features

### MiMo models in the model picker
Multiple MiMo models show up alongside GPT-4o, Claude, and friends in Copilot Chat's model selector. Switch models mid-chat without losing history.

### Available Models

| Model | Context | Best For |
|---|---|---|
| **MiMo V2.5 Pro** | 1M context, 128K output | Most capable reasoning model, complex agent tasks |
| **MiMo V2 Pro** | 1M context, 128K output | Pro model with reasoning capabilities |
| **MiMo V2.5 Omni** | 1M context, 128K output | Full multimodal understanding |
| **MiMo V2 Omni** | 256K context, 128K output | Omni model with multimodal capabilities |
| **MiMo V2 Flash** | 256K context, 64K output | Fast, efficient model for quick tasks |

### Thinking Mode with Reasoning Effort Control
Full support for MiMo's `reasoning_content`. Use Copilot Chat's native model picker menu to choose `none` (off), `high` (balanced, default), or `max` (deep reasoning for hard agent tasks).

### Inherits Every Copilot Capability
Because this plugs into Copilot's native provider API, you get the full stack for free:
- **Agent mode** — autonomous multi-step tasks
- **Tool calling** — file edits, terminal, workspace search, Git, tests
- **Instructions & skills** — all your `.instructions.md`, `AGENTS.md`, and skills just work
- **Prompt caching stats** — MiMo's cache hit rate logged in the output channel so you can see the savings

### Secure by Default
API key lives in VS Code's `SecretStorage` (OS keychain on macOS / Windows / Linux). Never in `settings.json`, never in your Git history.

### Zero Runtime Dependencies
Pure VS Code API + Node.js built-ins. No Python, no Docker, no local proxy server to babysit.

## Getting Started

### Prerequisites

- VS Code 1.116 or later. This extension relies on non-public Copilot Chat APIs that may break on newer VS Code versions — [report an issue](https://github.com/Vizards/mimo-for-copilot/issues) if you hit one.
- GitHub Copilot subscription (Free / Pro / Enterprise — the free tier works)
- MiMo API key from [platform.xiaomimimo.com](https://platform.xiaomimimo.com)
  - `sk-` prefix → Pay-as-you-go
  - `tp-` prefix → Token Plan (China)

### Installation

Install from the registry used by your editor:

1. **Microsoft VS Code** — install from [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Vizards.mimo-for-copilot).
2. **Editors that use Open VSX** — install from [Open VSX](https://open-vsx.org/extension/Vizards/mimo-for-copilot).

### Usage

1. Run **MiMo: Set API Key** from the Command Palette (`Cmd+Shift+P`)
2. Paste your key or compatible provider token (official MiMo keys usually start with `sk-`)
3. Open Copilot Chat, click the model picker, pick **MiMo V2.5 Pro**, **MiMo V2.5 Omni**, or any other MiMo model
4. That's it — chat away

## Settings

| Setting | Default | Description |
|---|---|---|
| `mimo-copilot.maxTokens` | `0` | Max output tokens (`0` = no limit). Useful for cost control |
| `mimo-copilot.modelIdOverrides` | prefilled official ID map | API model IDs to send for each MiMo model. Change only for compatible third-party APIs with different model names |
| `mimo-copilot.debugMode` | `minimal` | Diagnostic mode: `minimal` for token usage only, `metadata` for privacy-preserving logs, or `verbose` for full request dumps and pipeline snapshots under extension global storage. Full dumps may include sensitive prompt text, tool schemas, file snippets, and image descriptions. Use `MiMo: Open Request Dumps Folder` to open the dump location |
| `mimo-copilot.visionModel` | *(auto)* | Which Copilot model to proxy images through |
| `mimo-copilot.visionPrompt` | *(built-in)* | Prompt used to describe image attachments |

## API Endpoint Auto-Detection

The extension automatically detects the API endpoint based on your API key prefix:

- `sk-` → Pay-as-you-go (`https://api.xiaomimimo.com/v1`)
- `tp-` → Token Plan China (`https://token-plan-cn.xiaomimimo.com/v1`)
| `mimo-copilot.experimental.stabilizeToolList` | `false` | Experimental. Tries to pre-activate VS Code/Copilot virtual tools so the MiMo API `tools` parameter is more complete and stable across turns. May improve context-cache hit rate when enabled tools change between turns. Can increase input tokens because more function definitions may be included; cache-hit input tokens are cheaper but still count toward usage. Usually leave it off with 64 or fewer enabled tools unless the tool list still changes across turns; do not enable it with more than 128 enabled tools |

Thinking Effort is configured from Copilot Chat's model picker for each MiMo model.

Example `settings.json` override for compatible API proxies:

```json
{
  "mimo-copilot.modelIdOverrides": {
    "mimo-v2.5-pro": "your-pro-model-id",
    "mimo-v2-flash": "your-flash-model-id"
  }
}
```

## Compared to alternatives

| | This extension | Local proxy (e.g. LiteLLM) | Standalone MiMo extensions |
|---|---|---|---|
| Works inside Copilot Chat | ✅ | ✅ | ❌ separate UI |
| Agent mode, tools, skills | ✅ | ✅ | ⚠️ reimplemented |
| No extra process to run | ✅ | ❌ | ✅ |
| One-click install | ✅ | ❌ | ✅ |
| API key in OS keychain | ✅ | ❌ | ⚠️ varies |

## License

[MIT](LICENSE)

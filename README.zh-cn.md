<h1 align="center">MiMo for Copilot Chat</h1>

<p align="center">
  <!-- marketplace-readme:remove-start -->
  <a href="https://marketplace.visualstudio.com/items?itemName=wangxiaolong100.mimo-for-copilot"><img src="https://img.shields.io/badge/VS%20Code%20Marketplace-Install-007ACC?logo=visualstudiocode&logoColor=white&style=for-the-badge" alt="从 VS Code Marketplace 安装"></a>
  <a href="https://open-vsx.org/extension/wangxiaolong100/mimo-for-copilot"><img src="https://img.shields.io/badge/Open%20VSX-Install-6A4FB6?style=for-the-badge" alt="从 Open VSX 安装"></a>
  <br/>
  <!-- marketplace-readme:remove-end -->
  <img src="https://img.shields.io/github/v/release/wangxiaolong100/mimo-for-copilot?style=for-the-badge&label=Version" alt="版本" />
  <img src="https://vsmarketplacebadges.dev/installs-short/wangxiaolong100.mimo-for-copilot.svg?style=for-the-badge" alt="安装量" />
</p>

<p align="center">
  <a href="https://github.com/wangxiaolong100/mimo-for-copilot/blob/main/README.md">English</a> |
  简体中文
</p>

**在 Copilot Chat 模型选择器中直接使用 MiMo——无需离开你熟悉的 Copilot 工作流。**

<p align="center">
  <img src="resources/screenshots/01-picker.png" alt="MiMo 模型出现在 Copilot Chat 模型选择器中，带有可按模型独立设置的思考深度下拉菜单（停用 / 标准 / 深度）" width="800">
</p>

喜欢 MiMo 的性价比，但不想放弃 GitHub Copilot 的 Agent 模式、工具调用和成熟的交互体验？本扩展将 **MiMo Pro、Omni 和 Flash** 直接接入 Copilot Chat 模型选择器，支持**思考模式**，使用你自己的 API Key。

## 为什么选这个扩展？

- **不是替换 Copilot，而是增强它。** 没有新的侧边栏，没有新的聊天界面需要学习。只是在你已经在用的模型选择器中多了一个选项。
- **Agent 模式、工具调用、Instructions、MCP、Skills——全部正常运作。** Copilot 的完整能力栈，现在跑在 MiMo 上。
- **需自行提供 API Key，直接向 MiMo 付费。** 你的 API Key，你的账单，你的速率限制。密钥存储在操作系统密钥链中，不会以明文形式写入磁盘。

## 功能特性

### MiMo 模型出现在模型选择器中
多个 MiMo 模型与 GPT-4o、Claude 等并列在 Copilot Chat 的模型选择器中。可在对话中途切换模型，不丢失聊天历史。

### 可用模型

| 模型 | 上下文 | 最佳用途 |
|---|---|---|
| **MiMo V2.5 Pro** | 1M 上下文，128K 输出 | 最强推理模型，复杂 Agent 任务 |
| **MiMo V2 Pro** | 1M 上下文，128K 输出 | 具有推理能力的专业模型 |
| **MiMo V2.5 Omni** | 1M 上下文，128K 输出 | 全模态理解 |
| **MiMo V2 Omni** | 256K 上下文，128K 输出 | 具有多模态能力的 Omni 模型 |
| **MiMo V2 Flash** | 256K 上下文，64K 输出 | 快速高效，适合日常任务 |

### 思考模式与推理深度控制
完整支持 MiMo 的 `reasoning_content`。通过 Copilot Chat 模型选择器的菜单选择 `停用`、`标准`（均衡，默认）或 `深度`（适用于复杂 Agent 任务）。

### 继承全部 Copilot 能力
因为本扩展接入的是 Copilot 的原生 Provider API，所以你可以免费获得完整的能力栈：
- **Agent 模式** — 自主执行多步骤任务
- **工具调用** — 文件编辑、终端、工作区搜索、Git、测试
- **Instructions 和 Skills** — 你所有的 `.instructions.md`、`AGENTS.md` 和 skills 都能正常工作
- **提示缓存统计** — MiMo 的缓存命中率会记录在输出通道中，方便你查看节省情况

### 安全性优先
API Key 存储在 VS Code 的 `SecretStorage` 中（macOS / Windows / Linux 的系统密钥链）。不会写入 `settings.json`，也不会出现在 Git 历史中。

### 零运行时依赖
纯 VS Code API + Node.js 内置模块。无需 Python、Docker 或本地代理服务器。

## 快速开始

### 前置条件

- VS Code 1.116 或更高版本。本扩展依赖 Copilot Chat 的非公开 API，更新 VS Code 后可能失效——如果遇到问题请[提交 issue](https://github.com/wangxiaolong100/mimo-for-copilot/issues)。
- GitHub Copilot 订阅（Free / Pro / Enterprise——免费版即可）
- 来自 [platform.xiaomimimo.com](https://platform.xiaomimimo.com) 的 MiMo API Key
  - `sk-` 前缀 → 按量付费
  - `tp-` 前缀 → Token Plan（中国区）

### 安装

根据你使用的编辑器从对应的注册表安装：

1. **Microsoft VS Code** — 从 [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=wangxiaolong100.mimo-for-copilot) 安装。
2. **使用 Open VSX 的编辑器** — 从 [Open VSX](https://open-vsx.org/extension/wangxiaolong100/mimo-for-copilot) 安装。

### 使用方法

1. 在命令面板（`Cmd+Shift+P`）中运行 **MiMo: 设置 API Key**
2. 粘贴你的 Key 或兼容的服务商令牌（官方 MiMo Key 通常以 `sk-` 开头）
3. 打开 Copilot Chat，点击模型选择器，选择 **MiMo V2.5 Pro**、**MiMo V2.5 Omni** 或其他 MiMo 模型
4. 开始聊天

## 设置

| 设置 | 默认值 | 描述 |
|---|---|---|
| `mimo-copilot.maxTokens` | `0` | 每次请求的最大输出 Token 数（`0` = 无限制）。可用于控制成本 |
| `mimo-copilot.modelIdOverrides` | 预填充的官方 ID 映射 | 每个 MiMo 模型实际发送的 API 模型 ID。仅在对接使用不同模型名称的兼容第三方 API 时需要修改 |
| `mimo-copilot.debugMode` | `minimal` | 诊断模式：`minimal` 仅记录 Token 用量，`metadata` 记录隐私安全的日志，`verbose` 将完整请求体和管道快照写入扩展全局存储。完整转储可能包含敏感的提示词、工具模式、文件片段和图片描述。使用 `MiMo: 打开请求 Dump 目录` 打开转储位置 |
| `mimo-copilot.visionModel` | *（自动）* | 用于代理图片的 Copilot 模型 |
| `mimo-copilot.visionPrompt` | *（内置）* | 用于描述图片附件的提示词 |

## API 端点自动检测

扩展会根据你的 API Key 前缀自动检测 API 端点：

- `sk-` → 按量付费（`https://api.xiaomimimo.com/v1`）
- `tp-` → Token Plan 中国区（`https://token-plan-cn.xiaomimimo.com/v1`）
| `mimo-copilot.experimental.stabilizeToolList` | `false` | 实验性功能。尝试预先激活 VS Code/Copilot 虚拟工具，使 MiMo API 的 `tools` 参数在各轮次间更完整、更稳定。当启用的工具在各轮次间变化时，可能提升上下文缓存命中率。可能会增加 input tokens，因为会包含更多函数定义；缓存命中的 input tokens 单价更低，但仍会计入用量。通常在启用工具数不超过 64 个时保持关闭，除非工具列表仍在跨轮次变化；超过 128 个启用工具时不建议开启 |

思考深度通过 Copilot Chat 的模型选择器为每个 MiMo 模型独立配置。

兼容 API 代理的 `settings.json` 覆盖示例：

```json
{
  "mimo-copilot.modelIdOverrides": {
    "mimo-v2.5-pro": "your-pro-model-id",
    "mimo-v2-flash": "your-flash-model-id"
  }
}
```

## 与其他方案对比

| | 本扩展 | 本地代理（如 LiteLLM） | 独立 MiMo 扩展 |
|---|---|---|---|
| 在 Copilot Chat 中工作 | ✅ | ✅ | ❌ 独立界面 |
| Agent 模式、工具、Skills | ✅ | ✅ | ⚠️ 需重新实现 |
| 无需运行额外进程 | ✅ | ❌ | ✅ |
| 一键安装 | ✅ | ❌ | ✅ |
| API Key 在系统密钥链中 | ✅ | ❌ | ⚠️ 可能不同 |

## 许可证

[MIT](LICENSE)

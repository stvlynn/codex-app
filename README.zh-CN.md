# decode-codex

> [English](README.md) · **中文**

从本地安装的 **OpenAI Codex** macOS 桌面应用中取出最新代码，并把它压缩/打包后的 JavaScript 还原成可读、命名清晰的源码。

仓库提供两个协同工作的 **Skill**：

| Skill | 作用 | 产物 |
| ----- | ---- | ---- |
| [`codex-app-ref-refresh`](.agents/skills/codex-app-ref-refresh/) | 解包已安装的 `Codex.app`（`app.asar`）到 `./ref` 并格式化 | `./ref/` |
| [`deobfuscate-javascript`](.agents/skills/deobfuscate-javascript/) | 把 `ref/webview/assets` 里打包的 JS 反混淆成命名有意义的可读代码 | `./restored/` |

典型流程：**先从 App 同步到 `./ref`，再把 `./ref` 反混淆到 `./restored`。**

---

## 前置条件

- **macOS**，并已安装 **[Codex 桌面应用](https://chatgpt.com/codex)** 于 `/Applications/Codex.app`（同步 Skill 需要读取它的 `app.asar`）。
- **Node.js** `>=20.0.0` 与 **pnpm** `9.0.0` —— 根工作区使用 `pnpm`（启用 `corepack enable` 以使用声明的 `packageManager`）。
- **[Bun](https://bun.sh)**（反混淆 Skill 的脚本是用 `bun` 运行的 TypeScript）。
- 一个能运行 Skill 的 Agent（Claude Code，或任何读取 `.agents/skills` 的 Codex/Agent 环境）。也可以手动运行内置脚本，见下文。

两个 Skill 位于 [`.agents/skills/`](.agents/skills/)。把 Agent 指向本仓库后按名字调用即可；或直接运行脚本。

## 快速开始

```bash
make dev      # 安装依赖、验证工作区，并启动解包出的 Electron 应用
make electron-smoke # 验证并短时启动解包出的 Electron 应用
make check    # 运行类型检查 + 测试 + 文档检查
make help     # 显示所有可用目标
```

---

## Skill 1 — 同步最新 Codex 代码（`codex-app-ref-refresh`）

从已安装的 Codex App 重新生成 `./ref`，让你分析的源码始终对应当前安装的版本。它会**删除并替换 `./ref`**，把 `/Applications/Codex.app/Contents/Resources/app.asar` 解包进去，再用 Prettier 格式化所有解出来的 `.js`/`.css`（跳过 `ref/node_modules`）。

### 通过 Agent 使用

在仓库根目录让 Agent 执行：

> 用 **codex-app-ref-refresh** 从已安装的 Codex App 刷新 `./ref`。

### 或直接运行脚本

```bash
# 在仓库根目录（即要承载 ./ref 的目录）
node .agents/skills/codex-app-ref-refresh/scripts/refresh-codex-ref.mjs
```

可选项：

| 参数 / 环境变量 | 作用 |
| --------------- | ---- |
| `--dry-run` | 只打印解析出的路径，不删除、不解包 |
| `--skip-format` | 只解包，不跑 Prettier |
| `CODEX_APP_ASAR=/path/to/app.asar` | Codex 安装在非默认位置时指定 asar 路径 |

> ⚠️ 一定要在“要承载 `./ref` 的目录”里运行——脚本会先清空 `./ref`。它有保护：只有目标解析为当前目录下的 `./ref` 才会执行。

完成后，打包的 Web UI 在 `ref/webview/`（入口 `ref/webview/index.html`，代码块在 `ref/webview/assets/`）。

---

## Skill 2 — 反混淆同步后的代码（`deobfuscate-javascript`）

把解包进 `./ref` 的压缩、打包 JS 还原成可读代码。它是一条多阶段流水线（反混淆 → 智能重命名 → 润色 → 可选的带类型 `.tsx` 重写）。语义级的重命名由 Agent 本身完成，机械性的活由内置 `bun` 脚本处理。还原结果输出到 `./restored/`，带有有意义的命名、按语义领域分的子目录、出处头注释，以及共享的 `restored/IMPORT_MAP.json`。只有整理完成的文件才会进入 `./restored/`：脚本批量产出的机械中间产物会先放进隐藏的临时工作区（`restored/.deobfuscate-javascript/`），整理成可读性良好、命名友好、目录结构清晰（深度模式下还要类型完整）的代码后，才提升到 `./restored/`。

### 通过 Agent 使用

`./ref` 存在后，让 Agent 执行（中英文都能触发）：

> 用 **deobfuscate-javascript** 还原 `./ref`。

例如：*“反混淆 `./ref`”*、*“看懂这段 JS”*、*"deobfuscate `ref/webview/assets`"*。

### 两种深度

| 深度 | 触发方式 | 产物 |
| ---- | -------- | ---- |
| **可读**（默认） | 直接要求还原 | 可读、命名清晰的 JS/TSX——命名质量是硬指标 |
| **深度 / 生产级** | 说 **“深度” / “完整” / "deep" / "full" / "typed" / "production"** | 额外做带类型的 `.tsx` 重写、npm 依赖解析、完整的依赖图编排，以及验收复审循环 |

默认按**整棵依赖树**处理：读取 `ref/webview/index.html`，自动识别 App 入口，递归还原所有可达的项目本地代码块。如果你只贴一个文件，它就只还原那个文件。

### 首次安装脚本依赖

```bash
cd .agents/skills/deobfuscate-javascript
bun install
```

各个 `bun scripts/*.ts` 工具（detect、extract、smart-rename、polish、quality-gate 等）在该 Skill 的 [`SKILL.md`](.agents/skills/deobfuscate-javascript/SKILL.md) 中有说明。正常使用时你不需要手动调用——Agent 会自动编排它们。

---

## 目录结构

```
decode-codex/
├─ .agents/skills/
│  ├─ codex-app-ref-refresh/      # Skill 1：同步 Codex.app → ./ref
│  └─ deobfuscate-javascript/     # Skill 2：./ref → ./restored
├─ docs/                          # 项目规范与架构文档
├─ scripts/                       # 共享流水线辅助脚本与检查
├─ AGENTS.md                      # 指向 CLAUDE.md 的软链接（Agent 入口）
├─ CLAUDE.md                      # Agent 准则、文档地图与进化规则
├─ ref/                           # 解包出的 Codex App 源码（由 Skill 1 生成）
└─ restored/                      # 可读的反混淆产物（由 Skill 2 生成）
```

`ref/` 和 `restored/` 都是生成物——请用 Skill 重新生成，而不是手动编辑。

## Agent 使用指南

- 先读 [`CLAUDE.md`](CLAUDE.md)，再读 [`docs/`](docs/README.md) 的相关部分，然后再写代码。
- 边界不清晰时，先做假设之前询问。
- 完成任务后，如果行为、架构或规范发生变化，同步更新对应文档。

## 检查

```bash
npm run check          # 类型检查 + 测试 + 文档结构检查
npm run docs:check     # 校验 docs/ 子目录 README
```

每次提交前，pre-commit hook 都会运行 `docs:check` 和反混淆 Skill 的测试。

---

## ⚠️ 法律与道德提示

本项目仅用于对你已安装软件的**个人学习与互操作性研究**。解出的代码版权归 OpenAI 所有；请遵守 Codex 应用的许可协议与服务条款。不要再分发解出或还原后的代码。

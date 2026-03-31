# skillbox-cli

> **AI 工具 Skill 管理器** — 通过一个交互式终端界面，统一管理 Claude Code、Cursor、GitHub Copilot 等工具中安装的所有 skill。

[![npm version](https://img.shields.io/npm/v/skillbox-cli)](https://www.npmjs.com/package/skillbox-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

📖 **[English Documentation →](./README.md)**

---

## 什么是 skillbox-cli？

`skillbox-cli` 是一个命令行工具，帮助你统一管理本地各种 AI 编程工具中安装的 **skill**（也称为命令、规则或插件）。

随着 AI 编程工具越来越强大，你可能会在 Claude Code、Cursor、GitHub Copilot/Codex、OpenClaw 等工具中积累**数十个 skill**。`skillbox-cli` 提供一个**统一的界面**，让你轻松查看、开启和关闭所有这些 skill。

---

## 为什么需要 skillbox-cli？

现代 AI 编程工具支持自定义 skill/插件：

- **Claude Code** 将自定义斜杠命令存储在 `~/.claude/commands/`
- **Cursor** 将规则存储在 `~/.cursor/rules/`
- **GitHub Copilot / Codex** 将 skill 存储在 `~/.codex/skills/`
- **OpenClaw** 将 skill 存储在 `~/.openclaw/skills/`

### 问题所在

- 🗂️ **Skill 膨胀**：你积累了 20、30 甚至 50+ 个 skill 文件，分散在各个工具中
- 🤯 **上下文过载**：每个激活的 skill 都会向大模型的 prompt 添加上下文 token——skill 太多会降低性能并增加成本
- 🔀 **召回逻辑不稳**：当加载的 skill 过多时，AI 模型的技能路由和召回逻辑变得不可靠，响应质量下降
- 🔍 **缺乏可见性**：没有简单的方法可以在一个地方查看所有工具中安装的所有 skill

### 解决方案

`skillbox-cli` 让你能够：

1. **统览所有 skill**——按工具分类展示，一目了然
2. **一键开启/关闭 skill**——被关闭的 skill 会安全备份，不会删除
3. **随时恢复 skill**——需要时重新启用任何已备份的 skill
4. **减少上下文噪音**——只保留当前真正需要的 skill 处于激活状态

---

## 功能特性

- 📋 **交互式 TUI** — 通过键盘导航浏览和切换 skill
- 🔍 **多工具支持** — Claude Code、Cursor、Copilot/Codex、OpenClaw
- 🔄 **安全备份** — 关闭的 skill 备份到 `~/.skillbox/backups/`（路径可配置）
- ♻️ **轻松恢复** — 只需一个按键即可重新启用已备份的 skill
- ⚙️ **路径可配置** — 可为任意工具覆盖默认 skill 目录
- 📊 **统计命令** — 快速汇总每个工具中已启用/禁用的 skill 数量

---

## 安装

```bash
# 通过 npm 全局安装
npm install -g skillbox-cli

# 或使用 npx（无需安装）
npx skillbox-cli
```

---

## 快速开始

```bash
# 启动交互式 skill 管理器
skillbox

# 扫描并启动（与上面相同）
skillbox init

# 使用 list 别名
skillbox list
skillbox ls
```

### TUI 界面操作

| 按键 | 操作 |
|------|------|
| `↑` / `↓` | 上下导航选择 skill |
| `空格` 或 `Enter` | 开启/关闭选中的 skill |
| `R` | 刷新 skill 列表 |
| `C` | 显示配置路径信息 |
| `Q` 或 `Esc` | 退出 |

---

## 命令说明

### `skillbox` / `skillbox list` / `skillbox ls`

启动交互式 TUI，浏览和切换 skill。

```bash
skillbox
skillbox list
skillbox ls
```

### `skillbox init`

扫描所有已配置的 skill 目录并启动 TUI。

```bash
skillbox init
```

### `skillbox stats`

打印每个工具的 skill 数量汇总。

```bash
skillbox stats
```

输出示例：
```
Skill Summary
=============
  Claude Code              4 enabled, 1 disabled
  Cursor                   2 enabled, 0 disabled
  GitHub Copilot / Codex   1 enabled, 0 disabled
  OpenClaw                 0 enabled, 0 disabled

  Total: 7/8 skills enabled
```

### `skillbox config`

查看或修改配置。

```bash
# 显示当前配置
skillbox config

# 设置自定义备份目录
skillbox config --backup-path ~/my-skill-backups

# 覆盖特定工具的 skill 路径
skillbox config --tool-path claude:~/.claude/my-custom-commands

# 将工具路径重置为默认值
skillbox config --reset-tool claude

# 列出所有支持的工具及其默认路径
skillbox config --list-tools
```

---

## 默认 Skill 路径

| 工具 | 默认 Skill 路径 |
|------|-----------------|
| **Claude Code** | `~/.claude/commands/` |
| **Cursor** | `~/.cursor/rules/` |
| **GitHub Copilot / Codex** | `~/.codex/skills/` |
| **OpenClaw** | `~/.openclaw/skills/` |

可通过 `skillbox config --tool-path <工具名>:<路径>` 覆盖任意路径。

---

## 备份与恢复机制

**关闭**一个 skill 时：
- skill 文件从工具的 skill 目录移动到 `~/.skillbox/backups/<工具名>/`
- 原始文件从激活 skill 文件夹中删除

**重新开启**一个 skill 时：
- skill 文件从备份目录移回工具的 skill 目录

备份目录：`~/.skillbox/backups/`（可通过 `skillbox config --backup-path` 自定义）

---

## 配置文件位置

配置存储在：
- **Linux/macOS**：`~/.config/skillbox-cli-nodejs/config.json`
- **Windows**：`%APPDATA%\skillbox-cli-nodejs\config.json`

---

## 使用场景

- **减少 LLM 上下文**——关闭当前项目不需要的 skill，节省 token
- **项目专属 skill 集**——根据当前使用的语言或框架，启用/禁用不同的 skill 组合
- **安全试验新 skill**——尝试新 skill，如果影响现有功能可随时禁用
- **审计你的 skill**——清楚了解在所有 AI 工具中安装了哪些 skill

---

## 系统要求

- Node.js >= 18.0.0
- 一个或多个支持 skill/命令功能的 AI 编程工具

---

## 参与贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建功能分支
3. 提交你的修改
4. 发起 Pull Request

---

## 开源协议

MIT

---

## 相关关键词

skill 管理器、AI skill、AI 工具管理、Claude Code 命令、Cursor 规则、Copilot skill、Codex skill、提示词管理、AI 插件管理、skillbox、skill CLI、AI 编程助手

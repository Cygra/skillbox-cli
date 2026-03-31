# skillbox-cli

> **The AI Tool Skill Manager** — Organize, enable, and disable skills across Claude Code, Cursor, GitHub Copilot, and more from a single interactive terminal UI.

[![npm version](https://img.shields.io/npm/v/skillbox-cli)](https://www.npmjs.com/package/skillbox-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

📖 **[中文文档 →](./README.zh.md)**

---

## What is skillbox-cli?

`skillbox-cli` is a command-line tool that helps you manage **AI tool skills** (also called commands, rules, or plugins) installed across multiple AI coding assistants on your local machine.

As AI coding tools become more powerful, you might accumulate **dozens of skills** — custom commands, prompt files, and rules — spread across Claude Code, Cursor, GitHub Copilot/Codex, OpenClaw, and more. `skillbox-cli` gives you a **single place to view, enable, and disable them all**.

---

## Why Do You Need skillbox-cli?

Modern AI coding tools support custom skills/plugins:

- **Claude Code** stores custom slash commands in `~/.claude/commands/`
- **Cursor** stores project/user rules in `~/.cursor/rules/`
- **GitHub Copilot / Codex** stores skills in `~/.codex/skills/`
- **OpenClaw** stores skills in `~/.openclaw/skills/`

### The Problem

- 🗂️ **Skill bloat**: You accumulate 20, 30, even 50+ skill files across tools
- 🤯 **Context overload**: Every active skill adds context tokens to the LLM prompt — too many skills degrade performance and increase cost
- 🔀 **Inconsistent routing**: When too many skills are loaded, the AI model's skill-routing and recall logic becomes unreliable
- 🔍 **No visibility**: There's no easy way to see all installed skills across tools in one place

### The Solution

`skillbox-cli` lets you:

1. **See all your skills** grouped by tool in a clean TUI
2. **Toggle skills on/off** instantly — disabled skills are safely backed up, not deleted
3. **Restore skills** when you need them again
4. **Reduce context noise** by keeping only the skills you actually need active

---

## Features

- 📋 **Interactive TUI** — browse and toggle skills with keyboard navigation
- 🔍 **Multi-tool support** — Claude Code, Cursor, Copilot/Codex, OpenClaw
- 🔄 **Safe backup** — disabled skills are backed up to `~/.skillbox/backups/` (configurable)
- ♻️ **Easy restore** — re-enable any backed-up skill with a single keypress
- ⚙️ **Configurable paths** — override the default skill directory for any tool
- 📊 **Stats command** — quick summary of enabled/disabled skills per tool

---

## Installation

```bash
# Install globally via npm
npm install -g skillbox-cli

# Or use npx (no install required)
npx skillbox-cli
```

---

## Quick Start

```bash
# Launch the interactive skill manager
skillbox

# Scan and launch (same as above)
skillbox init

# Or use the list alias
skillbox list
skillbox ls
```

### In the TUI

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate between skills |
| `Space` or `Enter` | Toggle skill on/off |
| `R` | Refresh skill list |
| `C` | Show config path info |
| `Q` or `Esc` | Quit |

---

## Commands

### `skillbox` / `skillbox list` / `skillbox ls`

Launch the interactive TUI to browse and toggle skills.

```bash
skillbox
skillbox list
skillbox ls
```

### `skillbox init`

Scan all configured skill directories and launch the TUI.

```bash
skillbox init
```

### `skillbox stats`

Print a summary of installed skills per tool.

```bash
skillbox stats
```

Output:
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

View or modify configuration.

```bash
# Show current config
skillbox config

# Set a custom backup directory
skillbox config --backup-path ~/my-skill-backups

# Override the skills path for a specific tool
skillbox config --tool-path claude:~/.claude/my-custom-commands

# Reset a tool path to its default
skillbox config --reset-tool claude

# List all supported tools and their defaults
skillbox config --list-tools
```

---

## Default Skill Paths

| Tool | Default Skills Path |
|------|---------------------|
| **Claude Code** | `~/.claude/commands/` |
| **Cursor** | `~/.cursor/rules/` |
| **GitHub Copilot / Codex** | `~/.codex/skills/` |
| **OpenClaw** | `~/.openclaw/skills/` |

You can override any of these with `skillbox config --tool-path <tool>:<path>`.

---

## Backup & Restore

When you **disable** a skill:
- The skill file is moved from the tool's skills directory to `~/.skillbox/backups/<tool-name>/`
- The original file is removed from the active skills folder

When you **enable** a skill back:
- The skill file is moved from the backup directory back to the tool's skills directory

Backup directory: `~/.skillbox/backups/` (configurable via `skillbox config --backup-path`)

---

## Configuration File

Configuration is stored at:
- **Linux/macOS**: `~/.config/skillbox-cli-nodejs/config.json`
- **Windows**: `%APPDATA%\skillbox-cli-nodejs\config.json`

---

## Use Cases

- **Reduce LLM context** by disabling skills you don't need for your current project
- **Project-specific skill sets** — enable/disable skill groups depending on the language or framework you're working with
- **Experiment safely** — try a new skill, then disable it if it interferes with existing ones
- **Audit your skills** — get a clear picture of everything installed across all your AI tools

---

## Requirements

- Node.js >= 18.0.0
- One or more AI coding tools with skill/command support

---

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## License

MIT

---

## Related Keywords

skill manager, AI skills, Claude Code commands, Cursor rules, Copilot skills, Codex skills, AI tool management, skill organizer, prompt management, AI plugin manager, skillbox, skill CLI, AI assistant tools

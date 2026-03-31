import { program } from 'commander';
import { render } from 'ink';
import React from 'react';
import { App } from './ui/app.js';
import {
  getConfig,
  getConfigPath,
  getResolvedTools,
  setBackupPath,
  setToolPath,
  resetToolPath,
  DEFAULT_TOOLS,
} from './config.js';
import { scanAllSkills } from './scanner.js';

const VERSION = '0.1.0';

function launchTUI(): void {
  const scanResult = scanAllSkills();
  render(React.createElement(App, { initialScan: scanResult }));
}

function printConfig(): void {
  const config = getConfig();
  const tools = getResolvedTools();

  console.log('\nSkillbox Configuration');
  console.log('======================');
  console.log(`Config file:  ${getConfigPath()}`);
  console.log(`Backup path:  ${config.backupPath}\n`);
  console.log('Tool Skill Paths:');
  for (const tool of tools) {
    const isCustom = config.tools[tool.name] !== undefined;
    const marker = isCustom ? ' (custom)' : ' (default)';
    console.log(`  ${tool.displayName.padEnd(24)} ${tool.skillsPath}${marker}`);
  }
  console.log('');
}

function printStats(): void {
  const result = scanAllSkills();
  console.log('\nSkill Summary');
  console.log('=============');
  for (const tool of result.tools) {
    const skills = result.skillsByTool[tool.name] ?? [];
    const enabled = skills.filter((s) => s.enabled).length;
    const disabled = skills.filter((s) => !s.enabled).length;
    console.log(
      `  ${tool.displayName.padEnd(24)} ${enabled} enabled, ${disabled} disabled`
    );
  }
  const total = result.skills.length;
  const totalEnabled = result.skills.filter((s) => s.enabled).length;
  console.log(`\n  Total: ${totalEnabled}/${total} skills enabled\n`);
}

export function runCLI(): void {
  program
    .name('skillbox')
    .description('Manage AI tool skills (Claude Code, Cursor, Copilot, OpenClaw)')
    .version(VERSION, '-v, --version', 'Print version number');

  program
    .command('init', { isDefault: false })
    .description('Scan skill directories and launch the interactive TUI')
    .action(() => {
      console.log('Scanning skill directories...');
      launchTUI();
    });

  program
    .command('list', { isDefault: false })
    .alias('ls')
    .description('Open the interactive skill manager TUI')
    .action(() => {
      launchTUI();
    });

  program
    .command('config', { isDefault: false })
    .description('Show or modify skillbox configuration')
    .option('--backup-path <path>', 'Set custom backup directory path')
    .option(
      '--tool-path <tool:path>',
      'Set custom skills path for a tool (e.g., claude:~/.claude/commands)'
    )
    .option('--reset-tool <tool>', 'Reset a tool path to its default')
    .option('--list-tools', 'List all supported tools and their default paths')
    .action((opts) => {
      if (opts.listTools) {
        console.log('\nSupported Tools:');
        for (const tool of DEFAULT_TOOLS) {
          console.log(`  ${tool.name.padEnd(12)} ${tool.displayName}`);
          console.log(`  ${''.padEnd(12)} Default path: ${tool.skillsPath}`);
          console.log(`  ${''.padEnd(12)} ${tool.description}\n`);
        }
        return;
      }

      if (opts.backupPath) {
        setBackupPath(opts.backupPath);
        console.log(`✓ Backup path set to: ${opts.backupPath}`);
      }

      if (opts.toolPath) {
        const colonIdx = (opts.toolPath as string).indexOf(':');
        if (colonIdx === -1) {
          console.error('Error: --tool-path must be in format "tool:path"');
          process.exit(1);
        }
        const toolName = (opts.toolPath as string).slice(0, colonIdx);
        const toolPath = (opts.toolPath as string).slice(colonIdx + 1);
        setToolPath(toolName, toolPath);
        console.log(`✓ Tool "${toolName}" path set to: ${toolPath}`);
      }

      if (opts.resetTool) {
        resetToolPath(opts.resetTool as string);
        console.log(`✓ Tool "${opts.resetTool}" path reset to default`);
      }

      printConfig();
    });

  program
    .command('stats', { isDefault: false })
    .description('Show a summary of installed skills per tool')
    .action(() => {
      printStats();
    });

  // Default action: launch TUI when no command is given
  program.action(() => {
    launchTUI();
  });

  program.parse(process.argv);
}

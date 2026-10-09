import Conf from 'conf';
import { homedir } from 'os';
import { join } from 'path';

export interface ToolConfig {
  name: string;
  displayName: string;
  skillsPath: string;
  description: string;
}

export interface SkillboxConfig {
  backupPath: string;
  tools: Record<string, string>; // tool name -> skills path override
}

const DEFAULT_BACKUP_PATH = join(homedir(), '.skillbox', 'backups');

export const DEFAULT_TOOLS: ToolConfig[] = [
  {
    name: 'claude',
    displayName: 'Claude Code',
    skillsPath: join(homedir(), '.claude', 'commands'),
    description: 'Anthropic Claude Code custom slash commands',
  },
  {
    name: 'cursor',
    displayName: 'Cursor',
    skillsPath: join(homedir(), '.cursor', 'rules'),
    description: 'Cursor AI editor rules and skills',
  },
  {
    name: 'codex',
    displayName: 'GitHub Copilot / Codex',
    skillsPath: join(homedir(), '.codex', 'skills'),
    description: 'OpenAI Codex CLI skills',
  },
  {
    name: 'openclaw',
    displayName: 'OpenClaw',
    skillsPath: join(homedir(), '.openclaw', 'skills'),
    description: 'OpenClaw AI tool skills',
  },
];

const conf = new Conf<SkillboxConfig>({
  projectName: 'skillbox-cli',
  defaults: {
    backupPath: DEFAULT_BACKUP_PATH,
    tools: {},
  },
});

export function getConfig(): SkillboxConfig {
  return {
    backupPath: conf.get('backupPath'),
    tools: conf.get('tools'),
  };
}

export function setBackupPath(backupPath: string): void {
  conf.set('backupPath', backupPath);
}

export function setToolPath(toolName: string, skillsPath: string): void {
  const tools = conf.get('tools');
  tools[toolName] = skillsPath;
  conf.set('tools', tools);
}

export function resetToolPath(toolName: string): void {
  const tools = conf.get('tools');
  delete tools[toolName];
  conf.set('tools', tools);
}

export function getResolvedTools(): ToolConfig[] {
  const config = getConfig();
  return DEFAULT_TOOLS.map((tool) => ({
    ...tool,
    skillsPath: config.tools[tool.name] ?? tool.skillsPath,
  }));
}

export function getConfigPath(): string {
  return conf.path;
}

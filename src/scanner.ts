import { existsSync, readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';
import { getResolvedTools, getConfig, type ToolConfig } from './config.js';

export interface Skill {
  id: string;
  name: string;
  fileName: string;
  tool: string;
  toolDisplayName: string;
  path: string;
  enabled: boolean;
  backupPath?: string;
}

const SKILL_EXTENSIONS = new Set(['.md', '.txt', '.json', '.yaml', '.yml', '']);

function isSkillFile(fileName: string): boolean {
  const ext = extname(fileName).toLowerCase();
  // Accept common skill file types and extensionless files
  return SKILL_EXTENSIONS.has(ext) && !fileName.startsWith('.');
}

function scanSkillsInDir(
  dirPath: string,
  tool: ToolConfig,
  backupDirPath: string
): Skill[] {
  if (!existsSync(dirPath)) {
    return [];
  }

  const skills: Skill[] = [];

  try {
    const entries = readdirSync(dirPath);
    for (const entry of entries) {
      const fullPath = join(dirPath, entry);
      const stat = statSync(fullPath);

      if (stat.isFile() && isSkillFile(entry)) {
        const backupPath = join(backupDirPath, tool.name, entry);
        skills.push({
          id: `${tool.name}:${entry}`,
          name: basename(entry, extname(entry)),
          fileName: entry,
          tool: tool.name,
          toolDisplayName: tool.displayName,
          path: fullPath,
          enabled: true,
          backupPath,
        });
      } else if (stat.isDirectory() && !entry.startsWith('.')) {
        // Support skill directories (folders)
        const backupPath = join(backupDirPath, tool.name, entry);
        skills.push({
          id: `${tool.name}:${entry}`,
          name: entry,
          fileName: entry,
          tool: tool.name,
          toolDisplayName: tool.displayName,
          path: fullPath,
          enabled: true,
          backupPath,
        });
      }
    }
  } catch {
    // Ignore permission errors
  }

  return skills;
}

function scanDisabledSkills(
  tool: ToolConfig,
  backupDirPath: string
): Skill[] {
  const backupToolDir = join(backupDirPath, tool.name);
  if (!existsSync(backupToolDir)) {
    return [];
  }

  const skills: Skill[] = [];

  try {
    const entries = readdirSync(backupToolDir);
    for (const entry of entries) {
      const backupPath = join(backupToolDir, entry);
      skills.push({
        id: `${tool.name}:${entry}`,
        name: basename(entry, extname(entry)),
        fileName: entry,
        tool: tool.name,
        toolDisplayName: tool.displayName,
        path: join(tool.skillsPath, entry),
        enabled: false,
        backupPath,
      });
    }
  } catch {
    // Ignore permission errors
  }

  return skills;
}

export interface ScanResult {
  tools: ToolConfig[];
  skills: Skill[];
  skillsByTool: Record<string, Skill[]>;
}

export function scanAllSkills(): ScanResult {
  const tools = getResolvedTools();
  const config = getConfig();
  const backupPath = config.backupPath;

  const allSkills: Skill[] = [];

  for (const tool of tools) {
    const enabledSkills = scanSkillsInDir(tool.skillsPath, tool, backupPath);
    const disabledSkills = scanDisabledSkills(tool, backupPath);

    // Merge: enabled skills take priority; avoid duplicates
    const enabledIds = new Set(enabledSkills.map((s) => s.id));
    const uniqueDisabled = disabledSkills.filter((s) => !enabledIds.has(s.id));

    allSkills.push(...enabledSkills, ...uniqueDisabled);
  }

  const skillsByTool: Record<string, Skill[]> = {};
  for (const tool of tools) {
    skillsByTool[tool.name] = allSkills.filter((s) => s.tool === tool.name);
  }

  return { tools, skills: allSkills, skillsByTool };
}

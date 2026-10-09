import {
  existsSync,
  mkdirSync,
  renameSync,
  cpSync,
  readdirSync,
  statSync,
  rmSync,
} from 'fs';
import { dirname, join } from 'path';
import { getConfig } from './config.js';
import type { Skill } from './scanner.js';

function ensureDir(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Disable a skill: move it from the tool's skills directory to the backup.
 */
export function disableSkill(skill: Skill): void {
  if (!skill.enabled) {
    throw new Error(`Skill "${skill.name}" is already disabled.`);
  }

  if (!existsSync(skill.path)) {
    throw new Error(`Skill file not found: ${skill.path}`);
  }

  const backupPath = skill.backupPath ?? buildBackupPath(skill);
  ensureDir(dirname(backupPath));

  // Remove existing backup if present
  if (existsSync(backupPath)) {
    rmSync(backupPath, { recursive: true, force: true });
  }

  renameSync(skill.path, backupPath);
}

/**
 * Enable a skill: copy it from backup back to the tool's skills directory.
 */
export function enableSkill(skill: Skill): void {
  if (skill.enabled) {
    throw new Error(`Skill "${skill.name}" is already enabled.`);
  }

  const backupPath = skill.backupPath ?? buildBackupPath(skill);

  if (!existsSync(backupPath)) {
    throw new Error(`Backup not found for skill "${skill.name}": ${backupPath}`);
  }

  ensureDir(dirname(skill.path));

  const stat = statSync(backupPath);
  if (stat.isDirectory()) {
    cpSync(backupPath, skill.path, { recursive: true });
    rmSync(backupPath, { recursive: true, force: true });
  } else {
    renameSync(backupPath, skill.path);
  }
}

/**
 * Toggle a skill between enabled and disabled state.
 * Returns the new enabled state.
 */
export function toggleSkill(skill: Skill): boolean {
  if (skill.enabled) {
    disableSkill(skill);
    return false;
  } else {
    enableSkill(skill);
    return true;
  }
}

/**
 * List all backed up skills for a given tool.
 */
export function listBackedUpSkills(toolName: string): string[] {
  const config = getConfig();
  const backupToolDir = join(config.backupPath, toolName);

  if (!existsSync(backupToolDir)) {
    return [];
  }

  try {
    return readdirSync(backupToolDir);
  } catch {
    return [];
  }
}

function buildBackupPath(skill: Skill): string {
  const config = getConfig();
  return join(config.backupPath, skill.tool, skill.fileName);
}

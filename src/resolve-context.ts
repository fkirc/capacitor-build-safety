import { GitContext, resolveGitContext } from './git-context';
import { existsSync } from 'fs';
import { getDebugPath, logFatal, readJsonFile } from './util';
import { getDisablePath } from './disable/disable';

export interface CapSafeConfig {
  strictBranches: string[];
}

export interface CapSafeContext {
  gitContext: GitContext;
  config: CapSafeConfig;
  disabled: boolean;
}

export interface DisableFile {
  disabledBranch: string;
}

function resolveCapSafeConfig(gitContext: GitContext): CapSafeConfig {
  return {
    strictBranches: [], // TODO: Implement
  };
}

function resolveDisableFile(gitContext: GitContext): DisableFile | null {
  const disablePath = getDisablePath(gitContext);
  if (!existsSync(disablePath)) {
    return null;
  }
  const disable: Partial<DisableFile> = readJsonFile(disablePath);
  const disabledBranch = disable.disabledBranch;
  if (!disabledBranch) {
    logFatal(`Failed to parse ${getDebugPath(disablePath)}`);
  }
  return {
    disabledBranch,
  };
}

function checkDisableFile(
  gitContext: GitContext,
  disableFile: DisableFile | null,
): boolean {
  if (!disableFile) {
    return false;
  }
  // TODO: Remove disableFile if branches are not matching.
  // TODO: Match branches against CapSafeConfig.
  return disableFile.disabledBranch === gitContext.currentBranch;
}

export function resolveContext(): CapSafeContext {
  const gitContext = resolveGitContext();
  const config = resolveCapSafeConfig(gitContext);
  const disableFile = resolveDisableFile(gitContext);
  const disabled = checkDisableFile(gitContext, disableFile);
  return {
    gitContext,
    config,
    disabled,
  };
}

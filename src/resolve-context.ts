import { GitContext, resolveGitContext } from './git-context';
import { existsSync } from 'fs';
import { getDebugPath, logFatal, readJsonFile } from './util';
import { getDisablePath } from './disable/disable';

export interface CapSafeContext {
  gitContext: GitContext;
  disabled: boolean;
}

export interface DisableFile {
  disabledBranch: string;
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
  const disableFile = resolveDisableFile(gitContext);
  const disabled = checkDisableFile(gitContext, disableFile);
  return {
    gitContext,
    disabled,
  };
}

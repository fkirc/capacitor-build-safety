import { GitContext, resolveGitContext } from './git-context';
import { existsSync } from 'fs';
import {
  deleteFile,
  getDebugPath,
  joinDirWithFileName,
  logFatal,
  readJsonFile,
} from './util';

export interface CapSafeContext {
  gitContext: GitContext;
  disabled: boolean;
  disableFilePath: string;
}

export interface DisableFile {
  disabledBranch: string;
}

function resolveDisableFilePath(gitContext: GitContext): string {
  return joinDirWithFileName(gitContext.gitRootDir, 'capsafe.disable.json');
}

function resolveDisableFile(
  gitContext: GitContext,
  disableFilePath: string,
): DisableFile | null {
  if (!existsSync(disableFilePath)) {
    return null;
  }
  const disableFile: Partial<DisableFile> = readJsonFile(disableFilePath);
  const disabledBranch = disableFile.disabledBranch;
  if (!disabledBranch) {
    logFatal(
      `Missing property 'disabledBranch' in ${getDebugPath(disableFilePath)}`,
    );
  }
  return {
    disabledBranch,
  };
}

function checkDisableFile(
  gitContext: GitContext,
  disableFile: DisableFile | null,
  disableFilePath: string,
): boolean {
  if (!disableFile) {
    return false;
  }
  const currentBranch = gitContext.currentBranch;
  const disabledBranch = disableFile.disabledBranch;
  if (currentBranch === disabledBranch) {
    return true;
  } else {
    deleteFile(disableFilePath);
    console.log(
      `Re-enabled capsafe because the current branch \'${currentBranch}\' was not equal to branch \'${disabledBranch}\' in ${getDebugPath(
        disableFilePath,
      )}.`,
    );
    return false;
  }
}

export function resolveContext(): CapSafeContext {
  const gitContext = resolveGitContext();
  const disableFilePath = resolveDisableFilePath(gitContext);
  const disableFile = resolveDisableFile(gitContext, disableFilePath);
  const disabled = checkDisableFile(gitContext, disableFile, disableFilePath);
  return {
    gitContext,
    disabled,
    disableFilePath: disableFilePath,
  };
}

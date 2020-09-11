import {
  getDebugPath,
  joinDirWithFileName,
  writeJsonFileVerbose,
} from '../util';
import { CapSafeContext, DisableFile } from '../resolve-context';
import { GitContext } from '../git-context';

export function getDisablePath(gitContext: GitContext): string {
  return joinDirWithFileName(gitContext.gitRootDir, 'capsafe.disable.json');
}

export function checkCommandDisabled(context: CapSafeContext): boolean {
  if (!context.disabled) {
    return false;
  }
  const disablePath = getDisablePath(context.gitContext);
  console.log(
    `Skip execution because the current branch \'${
      context.gitContext.currentBranch
    }\' is disabled in ${getDebugPath(disablePath)}.`,
  );
  return true;
}

export function disableCommand(context: CapSafeContext): void {
  const disablePath = getDisablePath(context.gitContext);
  const disabledBranch = context.gitContext.currentBranch;
  const disableFile: DisableFile = {
    disabledBranch,
  };
  writeJsonFileVerbose(disablePath, disableFile);
  console.log(
    `Disabled capsafe for branch \'${disabledBranch}\'. To re-enable capsafe, switch branches or delete ${getDebugPath(
      disablePath,
    )}.`,
  );
}

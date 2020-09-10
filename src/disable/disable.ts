import {
  getCurrentBranchName,
  getDebugPath,
  getGitRootDir,
  joinDirWithFileName,
  writeJsonFileVerbose,
} from '../util';

export interface CapSafeDisable {
  disabledBranch: string;
}

function getDisablePath(): string {
  return joinDirWithFileName(getGitRootDir(), 'capsafe.disable.json');
}

export function disable(): void {
  const disablePath = getDisablePath();
  const currentBranchName = getCurrentBranchName();
  const capSafeDisable: CapSafeDisable = {
    disabledBranch: currentBranchName,
  };
  writeJsonFileVerbose(disablePath, capSafeDisable);
  console.error(
    `To re-enable capsafe, switch branches or delete ${getDebugPath(
      disablePath,
    )}.`,
  );
}

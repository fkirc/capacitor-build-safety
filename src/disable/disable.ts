import {
  getDebugPath,
  joinDirWithFileName,
  writeJsonFileVerbose,
} from '../util';
import { CapSafeContext } from '../config';

export interface CapSafeDisable {
  disabledBranch: string;
}

function getDisablePath(context: CapSafeContext): string {
  return joinDirWithFileName(
    context.gitContext.gitRootDir,
    'capsafe.disable.json',
  );
}

export function resolveDisableFile(): CapSafeDisable | null {
  return null;
}

export function disableCommand(context: CapSafeContext): void {
  const disablePath = getDisablePath(context);
  const capSafeDisable: CapSafeDisable = {
    disabledBranch: context.gitContext.currentBranch,
  };
  writeJsonFileVerbose(disablePath, capSafeDisable);
  console.error(
    `To re-enable capsafe, switch branches or delete ${getDebugPath(
      disablePath,
    )}.`,
  );
}

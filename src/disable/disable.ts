import { getDebugPath, writeJsonFileVerbose } from '../util';
import { CapSafeContext, DisableFile } from '../resolve-context';

export function checkCommandDisabled(context: CapSafeContext): boolean {
  if (!context.disabled) {
    return false;
  }
  console.log(
    `Skip execution because the current branch \'${
      context.gitContext.currentBranch
    }\' is disabled in ${getDebugPath(context.disableFilePath)}.`,
  );
  return true;
}

export function disableCommand(context: CapSafeContext): void {
  const disabledBranch = context.gitContext.currentBranch;
  const disableFilePath = context.disableFilePath;
  const disableFile: DisableFile = {
    disabledBranch,
  };
  writeJsonFileVerbose(disableFilePath, disableFile);
  console.log(
    `Disabled capsafe for branch \'${disabledBranch}\'. To re-enable capsafe, switch branches or delete ${getDebugPath(
      disableFilePath,
    )}.`,
  );
}

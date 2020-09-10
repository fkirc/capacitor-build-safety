import {
  getGitRootDir,
  joinDirWithFileName,
  writeJsonFileVerbose,
} from '../util';

function getDisablePath(): string {
  return joinDirWithFileName(getGitRootDir(), 'capsafe.disable.json');
}

export function disable(): void {
  writeJsonFileVerbose(getDisablePath(), 'stuff');
}

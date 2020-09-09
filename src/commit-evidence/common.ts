import { existsSync } from 'fs';
import { resolve } from 'path';
import { isDirectory, logFatal } from '../util';
import { execSync } from 'child_process';

export interface CommitEvidence {
  commitHash: string;
  created: string;
}

export function getCommitEvidencePath(buildDir: string): string {
  return resolve(buildDir) + '/' + 'commit-evidence.json';
}

function getDebugBuildDir(buildDir: string): string {
  return resolve(buildDir); // Show an absolute path to users in case of errors.
}

export function checkBuildDirOrDie(buildDir: string): void {
  if (!existsSync(buildDir)) {
    logFatal(`\'${getDebugBuildDir(buildDir)}\' does not exist.`);
  }
  if (!isDirectory(buildDir)) {
    logFatal(`\'${getDebugBuildDir(buildDir)}\' is not a directory.`);
  }
}

export function getCurrentCommitOrDie(): string {
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch (e) {
    //console.error(e.stderr.toString());
    logFatal(
      `Failed to retrieve the current commit - The current directory \'${process.cwd()}\' is probably not a git repo.`,
    );
  }
}

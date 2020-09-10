import { resolve } from 'path';
import { logFatal } from '../util';
import { execSync } from 'child_process';

export interface CommitEvidence {
  commitHash: string;
  created: string;
}

export function getCommitEvidencePath(buildDir: string): string {
  return resolve(buildDir) + '/' + 'commit-evidence.json';
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

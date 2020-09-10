import { joinDirWithFileName } from '../util';

export interface CommitEvidence {
  commitHash: string;
  created: string;
}

export function getCommitEvidencePath(buildDir: string): string {
  return joinDirWithFileName(buildDir, 'commit-evidence.json');
}

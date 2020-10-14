import { joinDirWithFileName } from '../util';

export interface CommitEvidence {
  branch: string | null;
  commitHash: string;
  treeHash: string;
  created: string;
}

export function getCommitEvidencePath(buildDir: string): string {
  return joinDirWithFileName(buildDir, 'commit-evidence.json');
}

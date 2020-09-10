import {
  checkBuildDirOrDie,
  CommitEvidence,
  getCommitEvidencePath,
  getCurrentCommitOrDie,
} from './common';
import { writeJsonFile } from '../util';

export function createCommitEvidence(buildDir: string): void {
  checkBuildDirOrDie(buildDir);
  const commitHash = getCurrentCommitOrDie();
  const evidence: CommitEvidence = {
    commitHash,
    created: new Date().toISOString(),
  };
  const targetPath = getCommitEvidencePath(buildDir);
  const jsonString = writeJsonFile(targetPath, evidence);
  console.log(`Wrote commit evidence ${jsonString} to \'${targetPath}\'`);
}

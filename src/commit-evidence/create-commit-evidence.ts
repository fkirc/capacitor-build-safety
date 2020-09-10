import {
  CommitEvidence,
  getCommitEvidencePath,
  getCurrentCommitOrDie,
} from './common';
import { checkDirOrDie, writeJsonFile } from '../util';

export function createCommitEvidence(buildDir: string): void {
  checkDirOrDie(buildDir);
  const commitHash = getCurrentCommitOrDie();
  const evidence: CommitEvidence = {
    commitHash,
    created: new Date().toISOString(),
  };
  const evidencePath = getCommitEvidencePath(buildDir);
  const jsonString = writeJsonFile(evidencePath, evidence);
  console.log(`Wrote commit evidence ${jsonString} to \'${evidencePath}\'`);
}

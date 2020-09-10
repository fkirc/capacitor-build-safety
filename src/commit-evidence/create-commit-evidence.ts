import { CommitEvidence, getCommitEvidencePath } from './common';
import { getHEADCommitHash, writeJsonFileVerbose } from '../util';

export function createCommitEvidence(buildDir: string): void {
  const commitHash = getHEADCommitHash();
  const evidence: CommitEvidence = {
    commitHash,
    created: new Date().toISOString(),
  };
  const evidencePath = getCommitEvidencePath(buildDir);
  writeJsonFileVerbose(evidencePath, evidence);
}

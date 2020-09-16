import { CommitEvidence, getCommitEvidencePath } from './common';
import { writeJsonFileVerbose } from '../util';
import { CapSafeContext } from '../resolve-context';

export function createCommitEvidence(
  context: CapSafeContext,
  buildDir: string,
): void {
  const evidence: CommitEvidence = {
    commitHash: context.gitContext.currentCommitHash,
    treeHash: context.gitContext.currentTreeHash,
    created: new Date().toISOString(),
  };
  const evidencePath = getCommitEvidencePath(buildDir);
  writeJsonFileVerbose(evidencePath, evidence);
}

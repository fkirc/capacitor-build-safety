import { CommitEvidence, getCommitEvidencePath } from './common';
import { getDebugPath, logFatal, readJsonFile } from '../util';
import { CapSafeContext } from '../resolve-context';
import { checkCommandDisabled } from '../disable/disable';

export function verifyCommitEvidence(
  context: CapSafeContext,
  buildDir: string,
): void {
  if (checkCommandDisabled(context)) {
    return;
  }
  const evidencePath = getCommitEvidencePath(buildDir);
  const evidence: Partial<CommitEvidence> = readJsonFile(evidencePath);
  if (!evidence.commitHash) {
    logFatal(`Did not find a commit hash in ${getDebugPath(evidencePath)}.`);
  }

  if (checkCommitHashes(evidence, evidencePath, context)) {
    return;
  } else if (checkTreeHashes(evidence, evidencePath, context)) {
    return; // If commit hashes are not matching, then the tree hashes might still match.
  } else {
    const currentCommit = context.gitContext.currentCommitHash;
    const evidenceCommit = evidence.commitHash;
    logFatal(
      `Current commit ${currentCommit} does not match with commit ${evidenceCommit} in ${getDebugPath(
        evidencePath,
      )}. Did you forget to build/sync with Capacitor?`,
    );
  }
}

function checkCommitHashes(
  evidence: Partial<CommitEvidence>,
  evidencePath: string,
  context: CapSafeContext,
): boolean {
  const currentCommit = context.gitContext.currentCommitHash;
  const evidenceCommit = evidence.commitHash;
  if (currentCommit === evidenceCommit) {
    console.log(
      `Verification succeeded: ${getDebugPath(
        evidencePath,
      )} is up-to-date with current commit ${currentCommit}.`,
    );
    return true;
  } else {
    return false;
  }
}

function checkTreeHashes(
  evidence: Partial<CommitEvidence>,
  evidencePath: string,
  context: CapSafeContext,
): boolean {
  const currentTree = context.gitContext.currentTreeHash;
  const evidenceTree = evidence.treeHash;
  if (currentTree === evidenceTree) {
    console.log(
      `Verification succeeded: ${getDebugPath(
        evidencePath,
      )} is up-to-date with current tree ${currentTree}.`,
    );
    return true;
  } else {
    return false;
  }
}

import { CommitEvidence, getCommitEvidencePath } from './common';
import {
  getDebugPath,
  logDeactivatableError,
  logFatal,
  readJsonFile,
} from '../util';
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
  if (
    checkHashes(
      'commit',
      {
        current: context.gitContext.currentCommitHash,
        evidence: evidence.commitHash,
      },
      evidencePath,
    )
  ) {
    return;
  } else if (
    checkHashes(
      'tree', // If commit hashes are not matching, then the tree hashes might still match.
      {
        current: context.gitContext.currentTreeHash,
        evidence: evidence.treeHash,
      },
      evidencePath,
    )
  ) {
    return;
  } else {
    const currentCommit = context.gitContext.currentCommitHash;
    const evidenceCommit = evidence.commitHash;
    logDeactivatableError(
      `Current commit ${currentCommit} does not match with commit ${evidenceCommit} in ${getDebugPath(
        evidencePath,
      )}`,
    );
  }
}

function checkHashes(
  kind: 'commit' | 'tree',
  hashes: {
    current: string;
    evidence: string | undefined;
  },
  evidencePath: string,
): boolean {
  if (!hashes.evidence) {
    logFatal(`Did not find a ${kind} hash in ${getDebugPath(evidencePath)}.`);
  }
  if (hashes.current.length < 20) {
    logFatal('Hash is too short for a safe comparison');
  }
  if (hashes.current === hashes.evidence) {
    console.log(
      `Verification succeeded: ${getDebugPath(
        evidencePath,
      )} is up-to-date with current ${kind} ${hashes.current}.`,
    );
    return true;
  } else {
    return false;
  }
}

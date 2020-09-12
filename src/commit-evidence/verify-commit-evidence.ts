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
  const currentCommit = context.gitContext.currentCommit;
  const evidenceCommit = evidence.commitHash;
  if (currentCommit !== evidenceCommit) {
    logFatal(
      `Current commit ${currentCommit} is not equal to commit ${evidenceCommit} in ${getDebugPath(
        evidencePath,
      )}. Did you forget to build/sync with Capacitor?`,
    );
  }
  console.log(
    `Verification succeeded: ${getDebugPath(
      evidencePath,
    )} is up-to-date with current commit ${currentCommit}.`,
  );
}

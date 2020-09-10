import {
  checkBuildDirOrDie,
  checkExistsOrDie,
  CommitEvidence,
  getCommitEvidencePath,
  getCurrentCommitOrDie,
} from './common';
import { getDebugPath, logFatal, readJsonFileOrDie } from '../util';

export function verifyCommitEvidence(buildDir: string): void {
  checkBuildDirOrDie(buildDir);
  const evidencePath = getCommitEvidencePath(buildDir);
  checkExistsOrDie(evidencePath);
  const evidence: Partial<CommitEvidence> = readJsonFileOrDie(evidencePath);
  if (!evidence.commitHash) {
    logFatal(`Did not find a commit hash in ${getDebugPath(evidencePath)}.`);
  }
  const currentCommit = getCurrentCommitOrDie();
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

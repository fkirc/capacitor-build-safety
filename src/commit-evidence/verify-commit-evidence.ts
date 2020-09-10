import { CommitEvidence, getCommitEvidencePath } from './common';
import {
  getDebugPath,
  getHEADCommitHash,
  logFatal,
  readJsonFile,
} from '../util';

export function verifyCommitEvidence(buildDir: string): void {
  const evidencePath = getCommitEvidencePath(buildDir);
  const evidence: Partial<CommitEvidence> = readJsonFile(evidencePath);
  if (!evidence.commitHash) {
    logFatal(`Did not find a commit hash in ${getDebugPath(evidencePath)}.`);
  }
  const currentCommit = getHEADCommitHash();
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

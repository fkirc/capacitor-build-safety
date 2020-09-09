import { checkBuildDirOrDie, getCurrentCommitOrDie } from '../common';

export function verifyCommitEvidence(buildDir: string): void {
  checkBuildDirOrDie(buildDir);
  getCurrentCommitOrDie();
  console.log('TODO Implement verifyCommitEvidence', buildDir); // TODO
}

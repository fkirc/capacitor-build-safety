import { checkBuildDirOrDie, getCurrentCommitOrDie } from '../common';

export function createCommitEvidence(buildDir: string): void {
  checkBuildDirOrDie(buildDir);
  getCurrentCommitOrDie();
  console.log('TODO: Implement createCommitEvidence', buildDir); // TODO
}

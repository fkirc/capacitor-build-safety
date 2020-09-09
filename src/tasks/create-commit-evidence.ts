import { checkBuildDirOrDie } from '../common';

export function createCommitEvidence(buildDir: string): void {
  checkBuildDirOrDie(buildDir);
  console.log('TODO: Implement createCommitEvidence', buildDir); // TODO
}

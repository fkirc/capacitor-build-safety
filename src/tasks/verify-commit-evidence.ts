import { checkBuildDirOrDie } from '../common';

export function verifyCommitEvidence(buildDir: string): void {
  checkBuildDirOrDie(buildDir);
  console.log('TODO Implement verifyCommitEvidence', buildDir); // TODO
}

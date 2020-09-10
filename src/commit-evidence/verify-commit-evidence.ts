import {
  checkBuildDirOrDie,
  checkExistsOrDie,
  getCommitEvidencePath,
  getCurrentCommitOrDie,
} from './common';
import { readJsonFileOrDie } from '../util';

export function verifyCommitEvidence(buildDir: string): void {
  checkBuildDirOrDie(buildDir);
  const targetPath = getCommitEvidencePath(buildDir);
  checkExistsOrDie(targetPath);
  const evidence = readJsonFileOrDie(targetPath);
  getCurrentCommitOrDie();
  console.log('TODO Implement verifyCommitEvidence', evidence); // TODO
}

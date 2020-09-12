import { runCommandOrDie } from './util';

export interface GitContext {
  gitRootDir: string;
  currentCommit: string;
  currentBranch: string;
}

export function resolveGitContext(): GitContext {
  // Order commands with ascending complexity.
  const gitRootDir = getGitRootDir();
  const currentCommit = getHEADCommitHash();
  const currentBranch = getCurrentBranch();
  return {
    gitRootDir,
    currentCommit,
    currentBranch,
  };
}

function getGitRootDir(): string {
  return runCommandOrDie('git rev-parse --show-toplevel').trim();
}

export function getHEADCommitHash(): string {
  return runCommandOrDie('git rev-parse HEAD').trim();
}

export function getCurrentBranch(): string {
  return runCommandOrDie(
    'git symbolic-ref --short HEAD || git name-rev --name-only HEAD',
  ).trim();
}

import { runCommandOrDie } from './util';

export interface GitContext {
  gitRootDir: string;
  currentCommitHash: string;
  currentTreeHash: string;
  currentBranch: string;
}

export function resolveGitContext(): GitContext {
  // The first command is important for error messages.
  const gitRootDir = getGitRootDir();
  const currentCommitHash = getHEADCommitHash();
  const currentTreeHash = getHEADTreeHash();
  const currentBranch = getCurrentBranch();
  return {
    gitRootDir,
    currentCommitHash,
    currentTreeHash,
    currentBranch,
  };
}

function getGitRootDir(): string {
  return runCommandOrDie('git rev-parse --show-toplevel').trim();
}

export function getHEADCommitHash(): string {
  return runCommandOrDie('git rev-parse HEAD').trim();
}

export function getHEADTreeHash(): string {
  return runCommandOrDie('git rev-parse HEAD^{tree}').trim();
}

export function getCurrentBranch(): string {
  return runCommandOrDie(
    'git symbolic-ref --short HEAD || git name-rev --name-only HEAD',
  ).trim();
}

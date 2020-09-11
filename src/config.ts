import { GitContext, resolveGitContext } from './git-context';
import { CapSafeDisable, resolveDisableFile } from './disable/disable';

export interface CapSafeConfig {
  strictBranches: string[];
}

export interface CapSafeContext {
  gitContext: GitContext;
  config: CapSafeConfig;
  disable: CapSafeDisable | null;
}

function resolveCapSafeConfig(gitContext: GitContext): CapSafeConfig {
  return {
    strictBranches: [], // TODO: Implement
  };
}

export function resolveContext(): CapSafeContext {
  const gitContext = resolveGitContext();
  const config = resolveCapSafeConfig(gitContext);
  const disable = resolveDisableFile();
  return {
    gitContext,
    config,
    disable,
  };
}

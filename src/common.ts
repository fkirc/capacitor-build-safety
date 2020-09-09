import { existsSync, lstatSync } from 'fs';
import { resolve } from 'path';

export function logError(msg: string): void {
  console.error(msg);
}

export function logFatal(msg: string): never {
  logError(`error: ${msg}`);
  return process.exit(1) as never;
}

function getDebugBuildDir(buildDir: string): string {
  return resolve(buildDir); // Show an absolute path to users in case of errors.
}

function isDirectory(path: string) {
  try {
    const stat = lstatSync(path);
    return stat.isDirectory();
  } catch (e) {
    return false;
  }
}

export function checkBuildDirOrDie(buildDir: string): void {
  if (!existsSync(buildDir)) {
    logFatal(`\'${getDebugBuildDir(buildDir)}\' does not exist.`);
  }
  if (!isDirectory(buildDir)) {
    logFatal(`\'${getDebugBuildDir(buildDir)}\' is not a directory.`);
  }
}

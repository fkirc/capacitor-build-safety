import { existsSync, lstatSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { execSync } from 'child_process';

export function joinDirWithFileName(dir: string, fileName: string): string {
  checkDir(dir);
  return join(resolve(dir), fileName);
}

function isDirectory(path: string): boolean {
  try {
    const stat = lstatSync(path);
    return stat.isDirectory();
  } catch (e) {
    return false;
  }
}

function checkDir(dir: string): void {
  checkExists(dir);
  if (!isDirectory(dir)) {
    logFatal(`${getDebugPath(dir)} is not a directory.`);
  }
}

function checkNotDir(path: string): void {
  checkExists(path);
  if (isDirectory(path)) {
    logFatal(`${getDebugPath(path)} is a directory.`);
  }
}

function checkExists(path: string): void {
  if (!existsSync(path)) {
    logFatal(`${getDebugPath(path)} does not exist.`);
  }
}

export function getDebugPath(path: string): string {
  return `\'${resolve(path)}\'`; // Show an absolute path to users in case of errors.
}

export function logFatal(msg: string): never {
  console.error(`error: ${msg}`);
  return process.exit(1) as never;
}

export function writeJsonFile(path: string, object: unknown): string {
  const jsonString = JSON.stringify(object);
  writeFileSync(path, jsonString, { encoding: 'utf8' });
  return jsonString;
}

export function writeJsonFileVerbose(path: string, object: unknown): void {
  const jsonString = writeJsonFile(path, object);
  console.log(`Wrote ${jsonString} to ${getDebugPath(path)}`);
}

export function readJsonFile<T>(path: string): Partial<T> {
  checkNotDir(path);
  try {
    const jsonString = readUtf8File(path);
    return JSON.parse(jsonString) as Partial<T>;
  } catch (e) {
    logFatal(`Failed to parse ${getDebugPath(path)}.`);
  }
}

function readUtf8File(filePath: string): string {
  return readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
}

function runCommandOrDie(command: string): string {
  try {
    return execSync(command).toString();
  } catch (e) {
    //console.error(e.stderr.toString());
    logFatal(
      `Failed to run \'${command}\' in current directory \'${process.cwd()}\'.`,
    );
  }
}

export function getHEADCommitHash(): string {
  return runCommandOrDie('git rev-parse HEAD').trim();
}

export function getGitRootDir(): string {
  return runCommandOrDie('git rev-parse --show-toplevel').trim();
}

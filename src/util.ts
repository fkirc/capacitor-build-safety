import { existsSync, lstatSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

export function isDirectory(path: string): boolean {
  try {
    const stat = lstatSync(path);
    return stat.isDirectory();
  } catch (e) {
    return false;
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

export function readJsonFileOrDie<T>(path: string): Partial<T> {
  checkNotDirOrDie(path);
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

function checkExistsOrDie(path: string): void {
  if (!existsSync(path)) {
    logFatal(`${getDebugPath(path)} does not exist.`);
  }
}

function checkNotDirOrDie(path: string): void {
  checkExistsOrDie(path);
  if (isDirectory(path)) {
    logFatal(`${getDebugPath(path)} is a directory.`);
  }
}

export function checkDirOrDie(dir: string): void {
  checkExistsOrDie(dir);
  if (!isDirectory(dir)) {
    logFatal(`${getDebugPath(dir)} is not a directory.`);
  }
}

import { lstatSync, readFileSync, writeFileSync } from 'fs';
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
  try {
    const jsonString = readUtf8File(path);
    return JSON.parse(jsonString);
  } catch (e) {
    logFatal(`Failed to parse ${getDebugPath(path)}.`);
  }
}

function readUtf8File(filePath: string): string {
  return readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
}

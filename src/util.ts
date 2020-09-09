import { lstatSync, writeFileSync } from 'fs';

export function isDirectory(path: string): boolean {
  try {
    const stat = lstatSync(path);
    return stat.isDirectory();
  } catch (e) {
    return false;
  }
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

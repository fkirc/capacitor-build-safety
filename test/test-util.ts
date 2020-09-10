import { exec, execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

function buildCapSafeCommand(args: string) {
  return `${process.cwd()}/bin/capsafe ${args}`;
}

export async function runCapSafe(args: string, pwd?: string): Promise<string> {
  const cmd = buildCapSafeCommand(args);
  return await runCommand(cmd, pwd);
}

export async function runCapSafeExpectFailure(
  args: string,
  pwd?: string,
): Promise<string> {
  const cmd = buildCapSafeCommand(args);
  return await runCommandExpectFailure(cmd, pwd);
}

export function runCommand(cmd: string, pwd?: string): Promise<string> {
  cmd = buildFinalCommand(cmd, pwd);
  console.log(`Run command \'${cmd}\'`);
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      console.log(stdout);
      if (error) {
        console.error(stderr);
        console.error(`Failed to execute \'${cmd}\'. See the output above.`);
        reject(stdout + stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

export function runCommandExpectFailure(
  cmd: string,
  pwd?: string,
): Promise<string> {
  cmd = buildFinalCommand(cmd, pwd);
  console.log(`Run expect-fail-command \'${cmd}\'`);
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      console.log(stdout);
      if (error) {
        console.log(stderr);
        resolve(stdout + stderr);
      } else {
        console.error(
          `error: command \'${cmd}\' succeeded although we expected an error`,
        );
        reject(stdout);
      }
    });
  });
}

function buildFinalCommand(cmd: string, pwd?: string) {
  if (pwd) {
    return `( cd "${pwd}" && ${cmd} )`;
  } else {
    return cmd;
  }
}

export function readJsonFile(jsonPath: string): unknown {
  const jsonString = readUtf8File(jsonPath);
  return JSON.parse(jsonString);
}

function readUtf8File(filePath: string): string {
  //console.log(`Read ${filePath} cwd: ${process.cwd()}`);
  return readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
}

export function getHeadCommitHash(): string {
  return execSync('git rev-parse HEAD').toString().trim();
}

export function writeJsonFileVerbose(path: string, object: unknown): void {
  console.log(`Write ${path}`, object);
  const jsonString = JSON.stringify(object);
  writeFileSync(path, jsonString, { encoding: 'utf8' });
}

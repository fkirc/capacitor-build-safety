import { exec } from 'child_process';

function buildCapSafeCommand(args: string) {
  return `${process.cwd()}/bin/capsafe ${args}`;
}

export async function runCapSafe(args: string): Promise<string> {
  const cmd = buildCapSafeCommand(args);
  return await runCommand(cmd);
}

export async function runCapSafeExpectFailure(args: string): Promise<string> {
  const cmd = buildCapSafeCommand(args);
  return await runCommandExpectFailure(cmd);
}

function runCommand(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      console.log(stdout);
      if (error) {
        console.error(stderr);
        reject(stdout + stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

function runCommandExpectFailure(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      console.log(stdout);
      if (error) {
        console.log(stderr);
        resolve(stdout + stderr);
      } else {
        console.error(
          `Error: command ${cmd} succeeded although we expected an error`,
        );
        reject(stdout);
      }
    });
  });
}

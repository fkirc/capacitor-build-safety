import { exec } from 'child_process';
import { join } from 'path';

export async function switchToNewFeatureBranch(): Promise<string> {
  const randomString = Math.random().toString();
  const branchName = `feature_${randomString}`;
  await runCommand(`git checkout -b ${branchName}`);
  return branchName;
}

function buildCapSafeCommand(args: string) {
  return `${join(process.cwd(), 'bin', 'capsafe')} ${args}`;
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

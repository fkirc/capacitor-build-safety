import { exec } from 'child_process';

export async function run(capSafeCommand: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(
      `${process.cwd()}/bin/capsafe ${capSafeCommand}`,
      (error, stdout, stderr) => {
        console.log(stdout);
        if (error) {
          console.error(stderr);
          reject(stdout + stderr);
        } else {
          resolve(stdout);
        }
      },
    );
  });
}

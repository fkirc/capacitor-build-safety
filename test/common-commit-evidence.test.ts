import { runCapSafeExpectFailure } from './test-util';
import { resolve } from 'path';

describe.each(['create-commit-evidence', 'verify-commit-evidence'])(
  'command: %s',
  command => {
    test('Not a directory', async () => {
      const output = await runCapSafeExpectFailure(`${command} package.json`);
      expect(output).toContain("/package.json' is not a directory.");
    });

    test('not in a git repo', async () => {
      const evidenceDir = resolve('test/sample-evidence/');
      const output = await runCapSafeExpectFailure(
        `${command} ${evidenceDir}`,
        '/',
      );
      expect(output).toContain(
        'fatal: not a git repository (or any of the parent directories): .git',
      );
      expect(output).toContain(
        "error: Failed to retrieve the current commit - The current directory '/' is probably not a git repo.",
      );
    });
  },
);

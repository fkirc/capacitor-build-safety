import { runCapSafeExpectFailure } from './test-util';
import { resolve } from 'path';

describe.each(['create-commit-evidence', 'verify-commit-evidence'])(
  'common errors of command: %s',
  command => {
    test('Not a directory', async () => {
      const output = await runCapSafeExpectFailure(`${command} package.json`);
      expect(output).toContain("/package.json' is not a directory.");
    });

    test('missing arg', async () => {
      const output = await runCapSafeExpectFailure(`${command}`);
      expect(output).toBe("error: missing required argument 'build-dir'\n");
    });

    test('unknown option', async () => {
      const output = await runCapSafeExpectFailure(
        `${command} --some-option=x`,
      );
      expect(output).toBe("error: unknown option '--some-option=x'\n");
    });

    test('invalid relative dir', async () => {
      const output = await runCapSafeExpectFailure(
        `${command} invalid-relative-dir/`,
      );
      expect(output).toContain("/invalid-relative-dir' does not exist.");
    });

    test('invalid absolut dir', async () => {
      const output = await runCapSafeExpectFailure(
        `${command} /invalid-absolute-dir`,
      );
      expect(output).toBe("error: '/invalid-absolute-dir' does not exist.\n");
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

import { runCapSafeExpectFailure } from './util';

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
  },
);

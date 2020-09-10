import { runCapSafeExpectFailure } from './test-util';

describe.each([
  'create-commit-evidence',
  'verify-commit-evidence',
  'validate-capacitor-config',
])('errors of command: %s', command => {
  test('unknown option', async () => {
    const output = await runCapSafeExpectFailure(`${command} --some-option=x`);
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

  test('missing arg', async () => {
    const output = await runCapSafeExpectFailure(`${command}`);
    expect(output).toContain("error: missing required argument '");
  });
});

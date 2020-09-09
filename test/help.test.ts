import { runCapSafe, runCapSafeExpectFailure } from './util';

const usageText =
  'Usage: capsafe [options] [command]\n\n' +
  'Options:\n' +
  '  -h, --help                          display help for command\n\n' +
  'Commands:\n' +
  '  create-commit-evidence <build-dir>  Creates an evidence file in <build-dir>\n' +
  '                                      that holds the current commit hash\n' +
  '  verify-commit-evidence <build-dir>  Verifies that the current commit\n' +
  '                                      matches with an evidence file in\n' +
  '                                      <build-dir>\n';

test('--help', async () => {
  const stdout = await runCapSafe(`--help`);
  expect(stdout).toBe(usageText);
});

test('-h', async () => {
  const stdout = await runCapSafe(`-h`);
  expect(stdout).toBe(usageText);
});

test('no arguments', async () => {
  const out = await runCapSafeExpectFailure('');
  expect(out).toBe(usageText);
});
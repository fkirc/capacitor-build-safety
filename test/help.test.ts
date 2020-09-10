import { runCapSafe, runCapSafeExpectFailure } from './test-util';

const usageText =
  'Usage: capsafe [options] [command]\n\n' +
  'Options:\n' +
  '  -h, --help                                         display help for command\n\n' +
  'Commands:\n' +
  '  create-commit-evidence <build-dir>                 Creates an evidence file in <build-dir> that holds the current commit hash\n' +
  '  verify-commit-evidence <build-dir>                 Verifies that the current commit matches with an evidence file in <build-dir>\n' +
  '  validate-capacitor-config <capacitor.config.json>  Checks <capacitor.config.json> for common mistakes\n';

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

test('unknown command', async () => {
  const out = await runCapSafeExpectFailure('fijsoijv');
  expect(out).toBe(
    "error: unknown command 'fijsoijv'. See 'capsafe --help'.\n",
  );
});

test('unknown option', async () => {
  const out = await runCapSafeExpectFailure('--version');
  expect(out).toBe("error: unknown option '--version'\n");
});

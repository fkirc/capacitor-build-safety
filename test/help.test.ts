import { runCapSafe, runCapSafeExpectFailure } from './test-util';

const usageText =
  'Usage: capsafe [options] [command]\n\n' +
  'Options:\n' +
  '  -h, --help                                         display help for command\n\n' +
  'Commands:\n' +
  '  create-commit-evidence <build-dir>                 Creates an evidence file in <build-dir> that holds the current commit hash\n' +
  '  verify-commit-evidence <build-dir>                 Verifies that the current commit matches with an evidence file in <build-dir>\n' +
  '  validate-capacitor-config <capacitor.config.json>  Checks <capacitor.config.json> for common mistakes\n' +
  '  disable                                            Temporarily disables capsafe; until the current branch is switched\n';

test('--help', async () => {
  const output = await runCapSafe(`--help`);
  expect(output).toBe(usageText);
});

test('-h', async () => {
  const output = await runCapSafe(`-h`);
  expect(output).toBe(usageText);
});

test('no arguments', async () => {
  const output = await runCapSafeExpectFailure('');
  expect(output).toBe(usageText);
});

test('unknown command', async () => {
  const output = await runCapSafeExpectFailure('fijsoijv');
  expect(output).toBe(
    "error: unknown command 'fijsoijv'. See 'capsafe --help'.\n",
  );
});

test('unknown option', async () => {
  const output = await runCapSafeExpectFailure('--version');
  expect(output).toBe("error: unknown option '--version'\n");
});

import { runCapSafe, runCapSafeExpectFailure } from './util';

const usageText = 'Usage: capsafe [options] [command] [arguments]';

test('--help', async () => {
  const stdout = await runCapSafe(`--help`);
  expect(stdout).toContain(usageText);
});

test('-h', async () => {
  const stdout = await runCapSafe(`-h`);
  expect(stdout).toContain(usageText);
});

test('no arguments', async () => {
  const out = await runCapSafeExpectFailure('');
  expect(out).toContain(usageText);
  expect(out).toContain('error: Missing command');
});

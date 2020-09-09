import { runCapSafe } from './util';

const usageText = 'Usage: capsafe [options] [command] [command]';

test('--help', async () => {
  const stdout = await runCapSafe(`--help`);
  expect(stdout).toContain(usageText);
});

test('-h', async () => {
  const stdout = await runCapSafe(`-h`);
  expect(stdout).toContain(usageText);
});

test('no arguments', async () => {
  const stdout = await runCapSafe('');
  expect(stdout).toContain(usageText);
});

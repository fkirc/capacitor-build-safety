import { run } from './util';

const usageText = 'Usage: capsafe [options] [command] [command]';

test('--help', async () => {
  const stdout = await run(`--help`);
  expect(stdout).toContain(usageText);
});

test('-h', async () => {
  const stdout = await run(`-h`);
  expect(stdout).toContain(usageText);
});

test('no arguments', async () => {
  const stdout = await run('');
  expect(stdout).toContain(usageText);
});

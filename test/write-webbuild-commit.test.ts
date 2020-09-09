import { run } from './util';

test('build folder present', async () => {
  await run(`write-webbuild-commit`);
});

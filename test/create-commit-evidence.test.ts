import { runCapSafe, runCapSafeExpectFailure } from './util';

test('missing arg', async () => {
  const stderr = await runCapSafeExpectFailure(`create-commit-evidence`);
  expect(stderr).toBe("error: required option '--build-dir' not specified\n");
});

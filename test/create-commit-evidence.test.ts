import { runCapSafe, runCapSafeExpectFailure } from './util';

test('missing arg', async () => {
  const output = await runCapSafeExpectFailure(`create-commit-evidence`);
  expect(output).toBe("error: required option '--build-dir' not specified\n");
});

test('valid dir', async () => {
  const output = await runCapSafe(
    `create-commit-evidence --build-dir="test/test-projects/"`,
  );
  expect(output).toBe("error: required option '--build-dir' not specified\n");
});

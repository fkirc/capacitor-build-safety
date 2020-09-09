import { runCapSafe, runCapSafeExpectFailure } from './util';

test('missing arg', async () => {
  const output = await runCapSafeExpectFailure(`create-commit-evidence`);
  expect(output).toBe("error: missing required argument 'build-dir'\n");
});

test('valid dir', async () => {
  const output = await runCapSafe(`create-commit-evidence test/test-projects/`);
  expect(output).toBe(
    'TODO: Implement createCommitEvidence test/test-projects/\n',
  );
});

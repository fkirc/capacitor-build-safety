import { runCapSafe } from './test-util';

test('valid dir', async () => {
  const output = await runCapSafe(
    `create-commit-evidence test/empty-test-project/`,
  );
  expect(output).toBe(
    'TODO: Implement createCommitEvidence test/empty-test-project/\n',
  );
});

import { runCapSafe } from './test-util';

test('valid dir', async () => {
  const output = await runCapSafe(`create-commit-evidence test/test-projects/`);
  expect(output).toBe(
    'TODO: Implement createCommitEvidence test/test-projects/\n',
  );
});

import { runCapSafe } from './test-util';

test('write success', async () => {
  const output = await runCapSafe(
    `create-commit-evidence test/empty-test-project/`,
  );
  expect(output).toContain('Wrote commit evidence {"commitHash":"');
  expect(output).toContain('"} to \'/');
  expect(output).toContain("/test/empty-test-project/commit-evidence.json'");
  // TODO: Check file exists, verify content.
});

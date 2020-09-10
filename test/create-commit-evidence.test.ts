import { getHeadCommitHash, readJsonFile, runCapSafe } from './test-util';
import { CommitEvidence } from '../src/commit-evidence/common';

test('create evidence', async () => {
  const output = await runCapSafe(
    `create-commit-evidence test/empty-test-project/`,
  );
  expect(output).toContain('Wrote commit evidence {"commitHash":"');
  expect(output).toContain('"} to \'/');
  expect(output).toContain("/test/empty-test-project/commit-evidence.json'");
  const evidence = readJsonFile(
    'test/empty-test-project/commit-evidence.json',
  ) as CommitEvidence;
  expect(typeof evidence.created === 'string').toBe(true);
  expect(typeof evidence.commitHash === 'string').toBe(true);
  expect(evidence.commitHash.length).toBe(40);
  expect(evidence.commitHash).toBe(getHeadCommitHash());
});

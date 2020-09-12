import { runCapSafe } from './test-util';
import { CommitEvidence } from '../src/commit-evidence/common';
import { readJsonFile } from '../src/util';
import { getHEADCommitHash } from '../src/git-context';

test('create evidence', async () => {
  const output = await runCapSafe(
    `create-commit-evidence test/create-evidence/`,
  );
  expect(output).toContain('Wrote {"commitHash":"');
  expect(output).toContain('"} to \'/');
  expect(output).toContain("/test/create-evidence/commit-evidence.json'");
  const evidence: Partial<CommitEvidence> = readJsonFile(
    'test/create-evidence/commit-evidence.json',
  );
  expect(typeof evidence.created === 'string').toBe(true);
  expect(typeof evidence.commitHash === 'string').toBe(true);
  expect(evidence.commitHash).toBe(getHEADCommitHash());
});

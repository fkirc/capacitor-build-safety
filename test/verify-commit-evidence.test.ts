import { runCapSafe, runCapSafeExpectFailure } from './test-util';
import { writeJsonFileVerbose } from '../src/util';
import { CommitEvidence } from '../src/commit-evidence/common';
import { getHEADCommitHash } from '../src/git-context';

export async function verifyCommitEvidenceSuccess(): Promise<void> {
  const commitHash = getHEADCommitHash();
  const evidence: CommitEvidence = {
    commitHash,
    created: 'not-a-date',
  };
  writeJsonFileVerbose('test/verify-evidence/commit-evidence.json', evidence);

  const output = await runCapSafe(
    `verify-commit-evidence test/verify-evidence/`,
  );
  expect(output).toContain("Verification succeeded: '/");
  expect(output).toContain(
    `/test/verify-evidence/commit-evidence.json\' is up-to-date with current commit ${commitHash}.\n`,
  );
}

export async function verifyCommitEvidenceWrongCommitHash(): Promise<string> {
  const output = await runCapSafeExpectFailure(
    `verify-commit-evidence test/sample-evidence`,
  );
  expect(output).toContain('error: Current commit ');
  expect(output).toContain(
    " is not equal to commit 0e827118c19e689ca08990a5c63b4567e884c153 in '/",
  );
  expect(output).toContain(
    "/test/sample-evidence/commit-evidence.json'. Did you forget to build/sync with Capacitor?\n",
  );
  return output;
}

test('verification success', async () => {
  await verifyCommitEvidenceSuccess();
});

test('wrong commit hash', async () => {
  await verifyCommitEvidenceWrongCommitHash();
});

test('evidence not found', async () => {
  const output = await runCapSafeExpectFailure(
    `verify-commit-evidence node_modules`,
  );
  expect(output).toContain(
    "/node_modules/commit-evidence.json' does not exist.\n",
  );
});

test('not a JSON', async () => {
  const output = await runCapSafeExpectFailure(
    `verify-commit-evidence test/not-a-json`,
  );
  expect(output).toContain('error: Failed to parse ');
  expect(output).toContain("/test/not-a-json/commit-evidence.json'.\n");
});

test('missing commit hash', async () => {
  const output = await runCapSafeExpectFailure(
    `verify-commit-evidence test/missing-commit-hash`,
  );
  expect(output).toContain("error: Did not find a commit hash in '/");
  expect(output).toContain(
    "/test/missing-commit-hash/commit-evidence.json'.\n",
  );
});

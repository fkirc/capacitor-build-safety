import {
  runCapSafe,
  runCapSafeExpectFailure,
  runCommand,
  switchToNewFeatureBranch,
} from './test-util';
import {
  getCurrentBranch,
  getHEADCommitHash,
  getHEADTreeHash,
} from '../src/git-context';
import { createCommitEvidenceSuccess } from './create-commit-evidence.test';

export async function verifyCommitEvidenceSuccess(): Promise<void> {
  const commitHash = getHEADCommitHash();
  const output = await runCapSafe(
    `verify-commit-evidence test/create-evidence/`,
  );
  expect(output).toContain("Verification succeeded: '/");
  expect(output).toContain(
    `/test/create-evidence/commit-evidence.json\' is up-to-date with current commit ${commitHash}.\n`,
  );
}

async function verifyCommitEvidenceMatchingTreeHashes(): Promise<void> {
  const treeHash = getHEADTreeHash();
  const output = await runCapSafe(
    `verify-commit-evidence test/create-evidence/`,
  );
  expect(output).toContain("Verification succeeded: '/");
  expect(output).toContain(
    `/test/create-evidence/commit-evidence.json\' is up-to-date with current tree ${treeHash}.\n`,
  );
}

export async function verifyCommitEvidenceWrongCommitHash(): Promise<string> {
  const output = await runCapSafeExpectFailure(
    `verify-commit-evidence test/sample-evidence`,
  );
  expect(output).toContain('error: Current commit ');
  expect(output).toContain(
    " does not match with commit 0e827118c19e689ca08990a5c63b4567e884c153 in '/",
  );
  expect(output).toContain(
    "/test/sample-evidence/commit-evidence.json': Run 'capsafe disable' to disable this check temporarily (if you know what you are doing)\n",
  );
  return output;
}

test('verification success commits matching', async () => {
  await createCommitEvidenceSuccess();
  await verifyCommitEvidenceSuccess();
});

test('amend commit message -> verify success -> add new commit -> verify fail', async () => {
  await createCommitEvidenceSuccess();

  const branchAtBegin = getCurrentBranch();
  await switchToNewFeatureBranch();

  await runCommand("git commit --amend -m 'Some changed commit message'");

  await verifyCommitEvidenceMatchingTreeHashes();

  await runCommand('git add -f test/create-evidence/commit-evidence.json');
  await runCommand('git commit --no-verify -m "Some new commit"');

  await verifyCommitEvidenceWrongCommitHash();

  await runCommand(`git checkout ${branchAtBegin}`);
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

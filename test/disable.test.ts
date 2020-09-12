import { runCapSafe, runCommand } from './test-util';
import { readJsonFile } from '../src/util';
import { getCurrentBranch } from '../src/git-context';
import {
  verifyCommitEvidenceSuccess,
  verifyCommitEvidenceWrongCommitHash,
} from './verify-commit-evidence.test';
import { DisableFile } from '../src/resolve-context';

async function switchToBranch(branchName: string) {
  await runCommand(`git branch -d ${branchName} || true`);
  await runCommand(
    `git checkout -b ${branchName} || git checkout ${branchName}`,
  );
}

async function runDisable(branchName: string) {
  const output = await runCapSafe(`disable`);
  expect(output).toContain(`Wrote {"disabledBranch":"${branchName}"} to \'/`);
  expect(output).toContain("/capsafe.disable.json'");
  expect(output).toContain(
    `Disabled capsafe for branch \'${branchName}\'. To re-enable capsafe, switch branches or delete `,
  );
  const capSafeDisable: Partial<DisableFile> = readJsonFile(
    'capsafe.disable.json',
  );
  expect(capSafeDisable.disabledBranch).toBe(branchName);
}

async function verifyCommitEvidenceDisabled(featureBranch: string) {
  const output = await runCapSafe(
    `verify-commit-evidence test/verify-evidence/`,
  );
  expect(output).toContain(
    `Skip execution because the current branch \'${featureBranch}\' is disabled in`,
  );
  expect(output).toContain(`/capsafe.disable.json\'.\n`);
}

beforeEach(async () => {
  await runCommand('rm -f capsafe.disable.json');
});

test('disable feature branch - re-enable after branch switching', async () => {
  const branchAtBegin = getCurrentBranch();
  const featureBranch = 'some_feature_branch';
  expect(branchAtBegin !== featureBranch).toBe(true);

  await switchToBranch(featureBranch);

  await verifyCommitEvidenceSuccess();

  await runDisable(featureBranch);

  await verifyCommitEvidenceDisabled(featureBranch);

  await runCommand(`git checkout ${branchAtBegin}`);

  const output = await verifyCommitEvidenceWrongCommitHash();
  expect(output).toContain('Deleted');
  expect(output).toContain("capsafe.disable.json'");
  expect(output).toContain('Re-enabled capsafe because the current branch ');
  expect(output).toContain("was not equal to branch 'some_feature_branch' in ");
  expect(output).toContain('capsafe.disable.json');
});

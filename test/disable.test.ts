import { runCapSafe, runCommand, switchToNewFeatureBranch } from './test-util';
import { readJsonFile } from '../src/util';
import { getCurrentBranch } from '../src/git-context';
import {
  verifyCommitEvidenceSuccess,
  verifyCommitEvidenceWrongCommitHash,
} from './verify-commit-evidence.test';
import { DisableFile } from '../src/resolve-context';
import { createCommitEvidenceSuccess } from './create-commit-evidence.test';

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
  const output = await runCapSafe(`verify-commit-evidence test/`);
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
  const featureBranch = await switchToNewFeatureBranch();

  await createCommitEvidenceSuccess();
  await verifyCommitEvidenceSuccess();

  await runDisable(featureBranch);

  await verifyCommitEvidenceDisabled(featureBranch);

  await runCommand(`git checkout ${branchAtBegin}`);

  const output = await verifyCommitEvidenceWrongCommitHash();
  expect(output).toContain('Deleted');
  expect(output).toContain("capsafe.disable.json'");
  expect(output).toContain('Re-enabled capsafe because the current branch ');
  expect(output).toContain("was not equal to branch 'feature_");
  expect(output).toContain('capsafe.disable.json');
});

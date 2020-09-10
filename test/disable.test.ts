import { runCapSafe, runCommand } from './test-util';
import { getCurrentBranchName, readJsonFile } from '../src/util';
import { CapSafeDisable } from '../src/disable/disable';

test('disable feature branch', async () => {
  const currentBranch = getCurrentBranchName();
  await runCommand(
    'git checkout -b some-feature-branch || git checkout some-feature-branch',
  );

  const output = await runCapSafe(`disable`);
  expect(output).toContain(
    'Wrote {"disabledBranch":"some-feature-branch"} to \'/',
  );
  expect(output).toContain("/capsafe.disable.json'");
  const capSafeDisable = readJsonFile('capsafe.disable.json') as CapSafeDisable;
  expect(typeof capSafeDisable.disabledBranch === 'string').toBe(true);
  expect(capSafeDisable.disabledBranch.length).toBeGreaterThanOrEqual(4);
  expect(capSafeDisable.disabledBranch).toBe(getCurrentBranchName());

  await runCommand(`git checkout ${currentBranch}`);
});

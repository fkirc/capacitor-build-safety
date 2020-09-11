import { runCapSafe, runCommand } from './test-util';
import { readJsonFile } from '../src/util';
import { CapSafeDisable } from '../src/disable/disable';
import { getCurrentBranch } from '../src/git-context';

test('disable feature branch', async () => {
  const currentBranch = getCurrentBranch();
  await runCommand('git branch -d some-feature-branch');
  await runCommand(
    'git checkout -b some-feature-branch || git checkout some-feature-branch',
  );

  const output = await runCapSafe(`disable`);
  expect(output).toContain(
    'Wrote {"disabledBranch":"some-feature-branch"} to \'/',
  );
  expect(output).toContain("/capsafe.disable.json'");
  const capSafeDisable = readJsonFile('capsafe.disable.json') as CapSafeDisable;
  expect(capSafeDisable.disabledBranch).toBe('some-feature-branch');

  await runCommand(`git checkout ${currentBranch}`);
});

import { runCommand, runCommandExpectFailure } from './test-util';

function cmdCreateCommitEvidence(path: string): string {
  return `git rev-parse HEAD > ${path}`;
}

function cmdVerifyCommitEvidence(path: string): string {
  return `git rev-parse HEAD | diff ${path} -`;
}

test('create verify success', async () => {
  const path = 'commit_evidence';
  await runCommand(cmdCreateCommitEvidence(path));
  await runCommand(cmdVerifyCommitEvidence(path));
});

test('verify fail', async () => {
  const path = 'LICENSE';
  const out = await runCommandExpectFailure(cmdVerifyCommitEvidence(path));
  expect(out).toContain(
    '< WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.',
  );
});

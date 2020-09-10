import { runCapSafeExpectFailure } from './test-util';

// TODO: verification success test

test('wrong commit hash', async () => {
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
  expect(output).toContain(
    "/test/not-a-json/commit-evidence.json' is not a JSON file.\n",
  );
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

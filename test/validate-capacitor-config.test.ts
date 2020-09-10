import { runCapSafe, runCapSafeExpectFailure } from './test-util';

test('validation success', async () => {
  const output = await runCapSafe(
    `validate-capacitor-config test/capacitor-config/success.capacitor.config.json`,
  );
  expect(output).toContain('Validation succeeded: ');
  expect(output).toContain(
    'test/capacitor-config/success.capacitor.config.json',
  );
});

test('validation fail', async () => {
  const output = await runCapSafeExpectFailure(
    `validate-capacitor-config test/capacitor-config/failure.capacitor.config.json`,
  );
  expect(output).toContain('error: Validation failed: server of ');
  expect(output).toContain(
    "test/capacitor-config/failure.capacitor.config.json' is not undefined.",
  );
});

test('not a JSON file', async () => {
  const output = await runCapSafeExpectFailure(
    `validate-capacitor-config LICENSE`,
  );
  expect(output).toContain('error: Failed to parse ');
  expect(output).toContain("/LICENSE'.\n");
});

test('not a file', async () => {
  const output = await runCapSafeExpectFailure(
    `validate-capacitor-config node_modules`,
  );
  expect(output).toContain('error: ');
  expect(output).toContain("/node_modules' is a directory.\n");
});

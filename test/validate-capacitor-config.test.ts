import { runCapSafeExpectFailure } from './test-util';

test('not a JSON file', async () => {
  const output = await runCapSafeExpectFailure(
    `validate-capacitor-config LICENSE`,
  );
  expect(output).toContain('error: Failed to parse ');
  expect(output).toContain("/LICENSE'.\n");
});

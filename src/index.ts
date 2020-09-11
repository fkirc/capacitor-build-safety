import program from 'commander';

import { createCommitEvidence } from './commit-evidence/create-commit-evidence';
import { verifyCommitEvidence } from './commit-evidence/verify-commit-evidence';
import { validateCapacitorConfig } from './validate-capacitor-config/validate-capacitor-config';
import { resolveContext } from './config';
import { disableCommand } from './disable/disable';

process.on('unhandledRejection', error => {
  console.error('[fatal]', error);
});

export function run(process: NodeJS.Process, cliBinDir: string): void {
  program
    .command('create-commit-evidence <build-dir>')
    .description(
      'Creates an evidence file in <build-dir> that holds the current commit hash',
    )
    .action(buildDir => {
      const context = resolveContext();
      return createCommitEvidence(context, buildDir);
    });
  program
    .command('verify-commit-evidence <build-dir>')
    .description(
      'Verifies that the current commit matches with an evidence file in <build-dir>',
    )
    .action(buildDir => {
      const context = resolveContext();
      return verifyCommitEvidence(context, buildDir);
    });
  program
    .command('validate-capacitor-config <capacitor.config.json>')
    .description('Checks <capacitor.config.json> for common mistakes')
    .action(buildDir => {
      return validateCapacitorConfig(buildDir);
    });
  program
    .command('disable')
    .description(
      'Temporarily disables capsafe; until the current branch is switched',
    )
    .action(() => {
      const context = resolveContext();
      return disableCommand(context);
    });
  program.addHelpCommand(false);

  program.parse(process.argv);
}

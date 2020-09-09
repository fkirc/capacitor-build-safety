import program from 'commander';

import { createCommitEvidence } from './tasks/create-commit-evidence';
import { verifyCommitEvidence } from './tasks/verify-commit-evidence';

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
      return createCommitEvidence(buildDir);
    });
  program
    .command('verify-commit-evidence <build-dir>')
    .description(
      'Verifies that the current commit matches with an evidence file in <build-dir>',
    )
    .action(buildDir => {
      return verifyCommitEvidence(buildDir);
    });
  program.addHelpCommand(false);

  program.parse(process.argv);
}

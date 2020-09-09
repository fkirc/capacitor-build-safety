import program from 'commander';

import { createCommitEvidence } from './tasks/create-commit-evidence';
import { verifyCommitEvidence } from './tasks/verify-commit-evidence';
import { logFatal } from './common';

process.on('unhandledRejection', error => {
  console.error('[fatal]', error);
});

export function run(process: NodeJS.Process, cliBinDir: string): void {
  program
    .command('create-commit-evidence')
    .description(
      'Creates an evidence file that holds the current HEAD-commit hash',
    )
    .requiredOption(
      '--build-dir',
      'Required: the directory where the evidence file should go',
    )
    .action(buildDir => {
      return createCommitEvidence(buildDir);
    });
  program
    .command('verify-commit-evidence')
    .description(
      'Verifies that the current HEAD-commit matches with an evidence file',
    )
    .requiredOption(
      '--build-dir',
      'Required: the directory where the evidence file should be found',
    )
    .action(buildDir => {
      return verifyCommitEvidence(buildDir);
    });

  program.arguments('[command]').action(cmd => {
    if (typeof cmd === 'undefined') {
      console.log('Capacitor Build Safety');
      program.outputHelp();
    } else {
      logFatal(`Unknown command: ${cmd}`);
    }
  });
  program.parse(process.argv);
}

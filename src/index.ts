import program from 'commander';

import { writeWebbuildCommit } from './tasks/write-webbuild-commit';
import { addCommand } from './tasks/add';
import { logFatal } from './common';

process.on('unhandledRejection', error => {
  console.error('[fatal]', error);
});

export function run(process: NodeJS.Process, cliBinDir: string) {
  program
    .command('write-webbuild-commit [platform]')
    .description('copy + update')
    .option(
      '--deployment',
      "Optional: if provided, Podfile.lock won't be deleted and pod install will use --deployment option",
    )
    .action(platform => {
      return writeWebbuildCommit(platform);
    });

  program
    .command('read-webbuild-commit [platform]')
    .description('add a native platform project')
    .action(platform => {
      return addCommand(platform);
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

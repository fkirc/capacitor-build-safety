import program from 'commander';

import { syncCommand } from './tasks/sync';
import { addCommand } from './tasks/add';
import { logFatal } from './common';

process.on('unhandledRejection', error => {
  console.error('[fatal]', error);
});

export function run(process: NodeJS.Process, cliBinDir: string) {
  program
    .command('sync [platform]')
    .description('copy + update')
    .option(
      '--deployment',
      "Optional: if provided, Podfile.lock won't be deleted and pod install will use --deployment option",
    )
    .action(platform => {
      return syncCommand(platform);
    });

  program
    .command('add [platform]')
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

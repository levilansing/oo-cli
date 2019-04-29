import {CliError} from '../lib/CliError';

process.on('uncaughtException', (e) => {
  if (e instanceof CliError) {
    console.error(`Error: ${e.message}`);
  } else {
    console.error(e);
  }
  process.exit(1);
});

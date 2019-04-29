import {CliError} from '../lib/CliError';

export class MissingOptionError extends CliError {
  constructor(optionName: string) {
    super(`Missing required option: --${optionName}`);
  }
}

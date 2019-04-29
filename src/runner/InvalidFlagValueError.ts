import {CliError} from '../lib/CliError';

export class InvalidFlagValueError extends CliError {
  constructor(flagName: string, value: string) {
    super(`Invalid value for flag --${flagName}: ${value}`);
  }
}

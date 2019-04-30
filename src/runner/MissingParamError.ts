import {CliError} from '../lib/CliError';

export class MissingParamError extends CliError {
  constructor(paramName: string) {
    super(`Missing required parameter: ${paramName}`);
  }
}

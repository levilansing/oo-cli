import {CliError} from '../lib/CliError';
import {Parser} from './Parser';

export class ParseError extends CliError {
  public parser: Parser;
  constructor(parser: Parser, message: string = 'Parse Error') {
    super(message);
    this.parser = parser;
  }
}

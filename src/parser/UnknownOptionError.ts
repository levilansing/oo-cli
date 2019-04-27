import {ParseError} from './ParseError';
import {Parser} from './Parser';

export class UnknownOptionError extends ParseError {
  constructor(parser: Parser, option: string) {
    const message = `Unknown Option: ${option}`;
    super(parser, message);
  }
}

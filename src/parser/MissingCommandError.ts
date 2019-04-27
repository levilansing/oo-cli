import {ParseError} from './ParseError';
import {Parser} from './Parser';

export class MissingCommandError extends ParseError {
  constructor(parser: Parser) {
    const message = 'A command is required';
    super(parser, message);
  }
}

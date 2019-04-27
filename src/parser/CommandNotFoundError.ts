import {ParseError} from './ParseError';
import {Parser} from './Parser';

export class CommandNotFoundError extends ParseError {
  constructor(parser: Parser, command: string) {
    const message = `Command not found: ${command}`;
    super(parser, message);
  }
}

import {ParseError} from './ParseError';
import {Parser} from './Parser';
export class MalformedOptionError extends ParseError {
  constructor(parser: Parser, arg: string) {
    const message = `Malformed flag or option: ${arg}`;
    super(parser, message);
  }
}

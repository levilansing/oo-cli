import {ParseError} from './ParseError';
import {Parser} from './Parser';

export class ExtraneousParamError extends ParseError {
  constructor(parser: Parser, option: string) {
    const message = `Unexpected parameter found: ${option}`;
    super(parser, message);
  }
}

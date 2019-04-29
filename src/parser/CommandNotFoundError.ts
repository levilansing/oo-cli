import {ParseError} from './ParseError';
import {Parser} from './Parser';

export class CommandNotFoundError extends ParseError {
  public command: string;
  constructor(parser: Parser, command: string) {
    const availableCommands = parser.manifest.commands.map((c) => c.command).join(', ');
    const message = `Command not found: ${command}\nAvailable commands include: ${availableCommands}`;
    super(parser, message);
    this.command = command;
  }
}

import {command, help} from '../decorators';

export class InitCommand {
  @command
  @help('Initialize a new oo-cli project')
  public init() {
    console.log('init');
  }
}

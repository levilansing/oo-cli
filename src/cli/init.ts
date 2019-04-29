import {command, flag, help, param} from '../decorators';

export class InitCommand {
  @flag('s')
  @help('Silence errors and output')
  public silent!: boolean;

  @param
  @help('the name of the project (/^[\\w-]+$/)')
  public name!: string;

  @command
  @help('Initialize a new oo-cli project')
  public init() {
    console.log(`init, silent: ${this.silent}`);
  }
}

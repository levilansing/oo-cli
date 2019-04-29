import {command, help, param, required} from '../decorators';

export class Add {
  @param
  @required
  @help('Name of the command to create')
  public name!: string;

  @command
  @help('Creates a template for a new command')
  public add() {
    console.log(`Adding command ${this.name}...`);
  }
}

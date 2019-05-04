import {command, flag} from '../../../exports';
import {DoorCommand} from './door';

export class GarageDoorCommand extends DoorCommand {
  @flag
  public toggle?: boolean;

  @command
  public garageDoor() {
    // no-op
  }
}

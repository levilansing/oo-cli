import {command} from '../../../exports';
import {DoorCommand} from './door';

export class InteriorDoorCommand extends DoorCommand {
  @command
  public interiorDoor() {
    // no-op
  }
}

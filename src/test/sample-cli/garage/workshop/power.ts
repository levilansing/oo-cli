import {command, flag, help, namespace, optional, param} from '../../../../decorators';

@namespace('garage workshop')
export class DoorCommand {
  @flag
  public status!: boolean;

  @param
  @help('`up` or `down` to power on or off')
  @optional
  public action?: string;

  @command
  public power() {
    // no-op
  }
}

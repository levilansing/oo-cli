import {command, flag, namespace} from '../../../decorators';

@namespace('garage')
export class DoorCommand {
  @flag
  public toggle!: boolean;

  @flag
  public on!: boolean;

  @flag
  public off!: boolean;

  @flag
  public all!: boolean;

  @command
  public lights() {
    // no-op
  }
}

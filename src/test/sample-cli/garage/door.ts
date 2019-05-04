import {flag, namespace, param} from '../../../decorators';

@namespace('garage')
export class DoorCommand {
  @flag('c')
  public check!: boolean;

  @param
  public action!: string;
}

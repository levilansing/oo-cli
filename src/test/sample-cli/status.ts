import { command, flag, help, invertible, multiple, optional, param } from '../../decorators';

export class StatusCommand {
  @flag('l')
  @help('Include lights')
  @invertible
  public lights?: boolean;

  @flag('d')
  @help('Include doors')
  @invertible
  public doors?: boolean;

  @flag('v')
  @help('Show detailed status information')
  public verbose!: boolean;

  @param
  @help('Specify name(s) of devices to check their status')
  @optional
  @multiple
  public devices?: string[];

  @command
  @help('Get the status of all smart devices')
  public status() {
    // no-op
  }
}

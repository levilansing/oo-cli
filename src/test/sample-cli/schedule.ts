import {command, flag, help, multiple, option, optional, param, required} from '../../decorators';

export class ScheduleCommand {
  @flag('u', 'replace')
  @help('Update an existing schedule for this named command')
  public update!: boolean;

  @flag('d', 'remove')
  @help('Delete any existing schedule for this named command')
  public delete!: boolean;

  @option('f')
  @help('Name of the floor')
  public floor?: string;

  @option('n')
  @required
  @help('Name of the scheduled item')
  @multiple
  public name!: string[];

  @param
  @help('The command to schedule')
  public what!: string;

  @param
  @help('The schedule for when to run the command')
  @optional
  public when!: string;

  @command('s')
  @help('Schedule or unschedule a command to run at a later time')
  public schedule() {
    // no-op
  }
}

import callsites from 'callsites';
import {callerPath} from '../lib/callerPath';
import {Manifest} from '../manifest/Manifest';
import {PropertyDecoratorParams} from '../types/decorators';

export function rootCommand(...args: PropertyDecoratorParams) {
  const decorator = (target: any, key: PropertyKey, descriptor?: PropertyDescriptor): any => {
    const path = callerPath(callsites());
    if (!path) {
      throw new Error('could not find locate caller');
    }
    Manifest.getCommandBuilder(target.constructor)
      .createCommand(key, path, '');

    return descriptor;
  };

  if (args.length > 0) {
    return decorator(...args);
  }
  return decorator;
}

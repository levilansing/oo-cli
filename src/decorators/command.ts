import callsites from 'callsites';
import {callerPath} from '../lib/callerPath';
import {Manifest} from '../manifest/Manifest';
import {PropertyDecoratorParams} from '../types/decorators';

export function command(...aliases: string[] | PropertyDecoratorParams) {
  let actualAliases: string[] = [];
  const decorator = (target: any, key: PropertyKey, _descriptor?: PropertyDescriptor) => {
    const path = callerPath(callsites());
    if (!path) {
      throw new Error('could not find locate caller');
    }
    Manifest.getCommandBuilder(target.constructor)
      .createCommand(key, path, key.toString(), actualAliases);
    return target;
  };

  if (aliases.length < 2 || aliases.every((item) => typeof item === 'string')) {
    actualAliases = aliases;
    return decorator;
  } else {
    return decorator(...aliases as PropertyDecoratorParams);
  }
}

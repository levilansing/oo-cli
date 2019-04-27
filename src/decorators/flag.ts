import {Manifest} from '../manifest/Manifest';
import {PropertyDecoratorParams} from '../types/decorators';

export function flag(...aliases: string[] | PropertyDecoratorParams) {
  let actualAliases: string[] = [];
  const decorator = (target: any, key: PropertyKey, _descriptor?: PropertyDescriptor) => {
    Manifest.getCommandBuilder(target.constructor)
      .setAliases(key, actualAliases)
      .createFlag(key, key.toString());
    return target;
  };

  if (aliases.length < 2 || aliases.every((item) => typeof item === 'string')) {
    actualAliases = aliases;
    return decorator;
  } else {
    return decorator(...aliases as PropertyDecoratorParams);
  }
}

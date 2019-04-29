import {Manifest} from '../manifest/Manifest';
import {PropertyDecoratorParams} from '../types/decorators';

export function invertible(...aliases: string[] | PropertyDecoratorParams) {
  let actualAliases: string[] = [];
  const decorator = (target: any, key: PropertyKey, descriptor?: PropertyDescriptor): any => {
    Manifest.getCommandBuilder(target.constructor)
      .setInvertible(key, actualAliases);
    return descriptor;
  };

  if (aliases.length < 2 || aliases.every((item) => typeof item === 'string')) {
    actualAliases = aliases;
    return decorator;
  } else {
    return decorator(...aliases as PropertyDecoratorParams);
  }
}

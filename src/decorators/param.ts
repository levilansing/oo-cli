import {Manifest} from '../manifest/Manifest';
import {PropertyDecoratorParams} from '../types/decorators';

export function param(...args: [] | [string] | PropertyDecoratorParams) {
  let name: string | undefined;
  const decorator = (target: any, key: PropertyKey, _descriptor?: PropertyDescriptor) => {
    Manifest.getCommandBuilder(target.constructor)
      .createParam(key, name || key.toString());
    return target;
  };

  if (args.length > 1) {
    return decorator(...args as PropertyDecoratorParams);
  } else {
    name = args[0];
    return decorator;
  }
}

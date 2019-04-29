import {Manifest} from '../manifest/Manifest';

export function defaultValue(value?: boolean | string) {
  return (target: any, key: PropertyKey, descriptor?: PropertyDescriptor): any => {
    Manifest.getCommandBuilder(target.constructor)
      .setOptional(key, true)
      .setDefaultValue(key, value);

    return descriptor;
  };
}

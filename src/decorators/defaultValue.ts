import {Manifest} from '../manifest/Manifest';

export function defaultValue(value?: boolean | string) {
  return (target: any, key: PropertyKey, _descriptor?: PropertyDescriptor) => {
    Manifest.getCommandBuilder(target.constructor)
      .setOptional(key, true)
      .setDefaultValue(key, value);
    return target;
  };
}

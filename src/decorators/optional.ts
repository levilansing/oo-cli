import {Manifest} from '../manifest/Manifest';

export function optional(target: any, key: PropertyKey, descriptor?: PropertyDescriptor): any {
  Manifest.getCommandBuilder(target.constructor).setOptional(key, true);
  return descriptor;
}

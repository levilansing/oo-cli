import {Manifest} from '../manifest/Manifest';

export function required(target: any, key: PropertyKey, descriptor?: PropertyDescriptor): any {
  Manifest.getCommandBuilder(target.constructor).setOptional(key, false);
  return descriptor;
}

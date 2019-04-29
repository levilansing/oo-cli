import {Manifest} from '../manifest/Manifest';

export function multiple(target: any, key: PropertyKey, descriptor?: PropertyDescriptor): any {
  Manifest.getCommandBuilder(target.constructor).setMultiple(key, true);
  return descriptor;
}

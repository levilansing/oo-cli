import {Manifest} from '../manifest/Manifest';

export function multiple(target: any, key: PropertyKey, _descriptor?: PropertyDescriptor) {
  Manifest.getCommandBuilder(target.constructor).setMultiple(key, true);
  return target;
}

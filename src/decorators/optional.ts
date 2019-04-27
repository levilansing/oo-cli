import {Manifest} from '../manifest/Manifest';

export function optional(target: any, key: PropertyKey, _descriptor?: PropertyDescriptor) {
  Manifest.getCommandBuilder(target.constructor).setOptional(key, true);
  return target;
}

import {Manifest} from '../manifest/Manifest';

export function required(target: any, key: PropertyKey, _descriptor?: PropertyDescriptor) {
  Manifest.getCommandBuilder(target.constructor).setOptional(key, false);
  return target;
}

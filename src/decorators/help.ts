import {Manifest} from '../manifest/Manifest';

export function help(shortHelp: string) {
  return (target: any, key: PropertyKey, _descriptor?: PropertyDescriptor) => {
    Manifest.getCommandBuilder(target.constructor).setHelp(key, shortHelp);
    return target;
  };
}

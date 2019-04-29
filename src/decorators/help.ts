import {Manifest} from '../manifest/Manifest';

export function help(shortHelp: string) {
  return (target: any, key: PropertyKey, descriptor?: PropertyDescriptor): any => {
    Manifest.getCommandBuilder(target.constructor).setHelp(key, shortHelp);
    return descriptor;
  };
}

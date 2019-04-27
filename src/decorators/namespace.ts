import {ClassFunction, Manifest} from '../manifest/Manifest';

export function namespace<TFunction extends ClassFunction>(namespacePath: string = '') {
  return (target: TFunction) => {
    Manifest.getCommandBuilder(target).setNamespace(namespacePath.split(' '));
    return target;
  };
}

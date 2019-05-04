import {ManifestDefinition} from '../types/manifest';
import {CommandBuilder} from './CommandBuilder';

export type ClassFunction = new (...args: any[]) => any;

export class Manifest {
  private static metadata: Map<ClassFunction, CommandBuilder> = new Map();

  public static reset() {
    this.metadata.clear();
  }

  public static getCommandBuilder(classFn: ClassFunction) {
    if (!this.metadata.has(classFn)) {
      this.metadata.set(classFn, new CommandBuilder(classFn));
    }
    return this.metadata.get(classFn)!;
  }

  public static compileManifest(basePath: string): ManifestDefinition {
    const manifest: ManifestDefinition = emptyManifest();

    this.metadata.forEach((builder, key) => {
      const namespace = builder.getNamespace();
      const subManifest = namespace.reduce((m, next) =>
        m.namespaces[next] ? m.namespaces[next] : (m.namespaces[next] = emptyManifest()),
        manifest
      );
      const cmd = builder.buildCommand(key.name, basePath);
      if (cmd) {
        subManifest.commands.push(cmd);
      }
    });

    return manifest;
  }
}

const emptyManifest = () => ({namespaces: {}, commands: []});

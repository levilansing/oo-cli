import * as path from 'path';
import {CommandDefinition, FlagDefinition, OptionDefinition, ParamDefinition} from '../types/manifest';
import {FLAG_DEFAULTS, OPTION_DEFAULTS, PARAM_DEFAULTS} from '../types/manifestDefaults';
import {CommandBuilderError} from './CommandBuilderError';

type PropDefinition = Partial<FlagDefinition | OptionDefinition | ParamDefinition>;

interface CommandData {
  command?: string;
  aliases?: string[];
  help?: string;
  documentation?: string;
  flags: FlagDefinition[];
  options: OptionDefinition[];
  params: ParamDefinition[];
}

export class CommandBuilder {
  private filePath: string | null = null;
  private namespacePath: string[] = [];
  private data: CommandData = {
    flags: [],
    options: [],
    params: []
  };
  private allProps: Map<PropertyKey, PropDefinition> = new Map();

  public setNamespace(namespacePath: string[]) {
    this.namespacePath = namespacePath;
    return this;
  }

  public getNamespace() {
    return this.namespacePath;
  }

  public setCommandHelp(help: string) {
    this.data.help = help;
    return this;
  }

  public createCommand(key: PropertyKey, filePath: string, command: string, aliases: string[] = []) {
    this.filePath = filePath;
    this.data.command = command;
    this.data.aliases = aliases;
    const lastProp = this.getProp(key);
    this.data.help = lastProp.help;
    return this;
  }

  public setHelp(key: PropertyKey, help: string) {
    const prop = this.getProp(key);
    prop.help = help;
    return this;
  }

  public setAliases(key: PropertyKey, aliases: string[]) {
    const prop = this.getProp<FlagDefinition | OptionDefinition>(key);
    prop.aliases = aliases;
    return this;
  }

  public setDefaultValue(key: PropertyKey, defaultValue?: string | boolean) {
    const prop = this.getProp(key);
    prop.defaultValue = defaultValue;
    return this;
  }

  public setOptional(key: PropertyKey, optional: boolean) {
    const prop = this.getProp<ParamDefinition | OptionDefinition>(key);
    prop.optional = optional;
    return this;
  }

  public setMultiple(key: PropertyKey, multiple: boolean) {
    const prop = this.getProp<ParamDefinition | OptionDefinition>(key);
    prop.multiple = multiple;
    return this;
  }

  public setInvertible(key: PropertyKey, aliases: string[] = []) {
    const prop = this.getProp<FlagDefinition>(key);
    prop.invertible = true;
    prop.invertedAliases = aliases;
    return this;
  }

  public createFlag(key: PropertyKey, name: string) {
    const prop = this.getProp<FlagDefinition>(key);
    prop.name = name;
    this.data.flags.push(prop);
    return this;
  }

  public createOption(key: PropertyKey, name: string) {
    const prop = this.getProp<OptionDefinition>(key);
    prop.name = name;
    this.data.options.push(prop);
    return this;
  }

  public createParam(key: PropertyKey, name: string) {
    const prop = this.getProp<ParamDefinition>(key);
    prop.name = name;
    this.data.params.push(prop);
    return this;
  }

  public buildCommand(className: string, basePath: string): CommandDefinition {
    const {command, aliases = [], help = '', flags = [], options = [], params = []} = this.data;
    if (!command) {
      throw new CommandBuilderError('Attempted to build a command without a name');
    }
    if (!this.filePath) {
      throw new CommandBuilderError('Could not locate source path of command');
    }
    return {
      path: path.relative(basePath, this.filePath),
      className,
      command,
      aliases,
      help,
      documentation: 'TBD',
      flags: flags.map((f) => this.prepareFlag(Object.assign({}, FLAG_DEFAULTS, f))),
      options: options.map((o) => Object.assign({}, OPTION_DEFAULTS, o)),
      params: params.map((p) => Object.assign({}, PARAM_DEFAULTS, p)),
    };
  }

  private getProp<T extends PropDefinition = PropDefinition>(key: PropertyKey) {
    let prop = this.allProps.get(key) as T;
    if (!prop) {
      prop = {} as T;
      this.allProps.set(key, prop);
    }
    return prop;
  }

  private prepareFlag(flag: FlagDefinition) {
    if (flag.invertible && flag.invertedAliases.length === 0) {
      flag.invertedAliases = this.invertNames([flag.name, ...flag.aliases]);
    }
    return flag;
  }

  private invertNames(names: string[]) {
    return names.map((name) => {
      if (name.length === 1) {
        if (name === name.toLocaleLowerCase()) {
          return name.toLocaleUpperCase();
        } else {
          return name.toLocaleLowerCase();
        }
      }
      if (name.startsWith('no-')) {
        return name.slice(3);
      }
      return `no-${name}`;
    });
  }
}

import * as path from 'path';
import {CommandDefinition, FlagDefinition, OptionDefinition, ParamDefinition} from '../types/manifest';
import {FLAG_DEFAULTS, OPTION_DEFAULTS, PARAM_DEFAULTS} from '../types/manifestDefaults';
import {CommandBuilderError} from './CommandBuilderError';
import {ClassFunction, Manifest} from './Manifest';

type PropDefinition = Partial<FlagDefinition | OptionDefinition | ParamDefinition>;

interface CommandData {
  command?: string;
  key?: string;
  aliases?: string[];
  help?: string;
  documentation?: string;
  flags: FlagDefinition[];
  options: OptionDefinition[];
  params: ParamDefinition[];
}

export class CommandBuilder {
  private classFn: ClassFunction;
  private filePath: string | null = null;
  private namespacePath: string[] = [];
  private data: CommandData = {
    flags: [],
    options: [],
    params: []
  };
  private allProps: Map<PropertyKey, PropDefinition> = new Map();

  public constructor(classFn: ClassFunction) {
    this.classFn = classFn;
  }

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
    this.data.key = key.toString();
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
    prop.key = key.toString();
    prop.name = name;
    this.data.flags.push(prop);
    return this;
  }

  public createOption(key: PropertyKey, name: string) {
    const prop = this.getProp<OptionDefinition>(key);
    prop.key = key.toString();
    prop.name = name;
    this.data.options.push(prop);
    return this;
  }

  public createParam(key: PropertyKey, name: string) {
    const prop = this.getProp<ParamDefinition>(key);
    prop.key = key.toString();
    prop.name = name;
    this.data.params.push(prop);
    return this;
  }

  public buildCommand(className: string, basePath: string): CommandDefinition | null {
    const {key, command, aliases = [], help = '', flags = [], options = [], params = []} = this.data;
    let parent = Object.getPrototypeOf(this.classFn);
    if (parent) {
      const data = Manifest.getCommandBuilder(parent).data;
      flags.splice(0, 0, ...data.flags);
      options.splice(0, 0, ...data.options);
      params.splice(0, 0, ...data.params);
    }
    if (!key || !command) {
      return null;
    }
    if (!this.filePath) {
      throw new CommandBuilderError('Could not locate source path of command');
    }

    const uniq = (opts: PropDefinition[]) => opts.reverse().filter((o, index) => index === opts.findIndex((opt) => opt.name === o.name)).reverse();
    return {
      path: path.relative(basePath, this.filePath),
      className,
      key,
      command,
      aliases,
      help,
      documentation: 'TBD',
      flags: uniq(flags).map((f) => this.prepareFlag(Object.assign({}, FLAG_DEFAULTS, f))),
      options: uniq(options).map((o) => Object.assign({}, OPTION_DEFAULTS, o)),
      params: uniq(params).map((p) => Object.assign({}, PARAM_DEFAULTS, p)),
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

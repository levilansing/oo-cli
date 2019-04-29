import {CommandDefinition, FlagDefinition, ManifestDefinition, OptionDefinition} from '../types/manifest';
import {CommandNotFoundError} from './CommandNotFoundError';
import {ExtraneousParamError} from './ExtraneousParamError';
import {MalformedOptionError} from './MalformedOptionError';
import {MissingCommandError} from './MissingCommandError';
import {UnknownOptionError} from './UnknownOptionError';

const FLAG_OR_OPTION = /^--?[\w-]*(?:=.*)?$/;
const FLAG_OR_OPTION_PARSER = /^-(\w+)$|^-(\w)=(.*)$|^--(\w[\w-]*)(?:=(.*))?$/;
const INVALID_FLAG = /^-\w\w*-|^-\w[\w-]+=|^--\w[^\w-]/;
const DIRECTIVE_PART = /^\w[\w-]*$/;

export class Parser {
  public namespace: string[] = [];
  public manifest: ManifestDefinition;
  public commandConfig: any = {};
  public command?: CommandDefinition;

  constructor(manifest: ManifestDefinition) {
    this.manifest = manifest;
  }

  public parse(args: string[] = process.argv.slice(2)) {
    this.parseOutNamespace(args);
    this.command = this.manifest.commands.find((c) => c.command === '');
    if (!this.command) {
      this.command = this.getCommand(args.shift());
    }
    this.parseArgs(this.command, args);
    return {
      command: this.command,
      commandConfig: this.commandConfig
    };
  }

  private parseOutNamespace(args: string[]) {
    while (DIRECTIVE_PART.test(args[0]) && this.manifest.namespaces[args[0]]) {
      this.manifest = this.manifest.namespaces[args[0]];
      this.namespace.push(args.shift()!);
    }
  }

  private getCommand(name: string | undefined) {
    if (!name) {
      throw new MissingCommandError(this);
    }

    if (!DIRECTIVE_PART.test(name)) {
      throw new CommandNotFoundError(this, name);
    }

    const command = this.manifest.commands.find((cmd) => (
      cmd.command === name || cmd.aliases.includes(name)
    ));

    if (!command) {
      throw new CommandNotFoundError(this, name);
    }

    return command;
  }

  private parseArgs(command: CommandDefinition, args: string[]) {
    let paramsOnly = false;
    let nextParamIndex = 0;
    let canBeParam = true;
    let seenParam = false;

    for (const arg of args) {
      if (arg === '--') {
        paramsOnly = true;
        continue;
      }

      if (!paramsOnly && FLAG_OR_OPTION.test(arg)) {
        if (INVALID_FLAG.test(arg)) {
          throw new MalformedOptionError(this, arg);
        }

        this.parseFlagsOrOption(arg).forEach(({name, value}) => {
          const {flag, inverted} = this.findFlag(name, command.flags);
          if (flag) {
            const flagValue = flag.invertible ? (inverted ? 'false' : 'true') : (value  || 'true');
            this.setConfig(flag.name, flagValue);
            canBeParam = !seenParam;
            return;
          }

          const option = this.findOption(name, command.options);
          if (option) {
            this.setConfig(option.name, value, option.multiple);
            canBeParam = !seenParam;
            return;
          }

          throw new UnknownOptionError(this, arg);
        });

        continue;
      }

      if (!canBeParam || nextParamIndex >= command.params.length) {
        throw new ExtraneousParamError(this, arg);
      }

      const param = command.params[nextParamIndex];
      this.setConfig(param.name, arg, param.multiple);
      seenParam = true;
      if (!param.multiple) {
        nextParamIndex++;
      }
    }
  }

  private parseFlagsOrOption(args: string): Array<{name: string; value?: string}> {
    const matches = args.match(FLAG_OR_OPTION_PARSER) || [];
    if (matches[1]) {
      return matches[1].split('').map((name) => ({name}));
    } else {
      return [{
        name: matches[2] || matches[4],
        value: matches[3] || matches[5]
      }];
    }
  }

  private findFlag(name: string, flags: FlagDefinition[]) {
    let inverted = false;
    const flag = flags.find((f) => {
      if (f.name === name || f.aliases.includes(name)) {
        return true;
      }
      return f.invertible && (inverted = f.invertedAliases.includes(name));
    });

    return {flag, inverted};
  }

  private findOption(name: string, options: OptionDefinition[]): OptionDefinition | undefined {
    return options.find((option) => (
      option.name === name || option.aliases.includes(name)
    ));
  }

  private setConfig(name: string, value?: string | boolean, multiple = false) {
    if (multiple) {
      if (!this.commandConfig[name]) {
        this.commandConfig[name] = [];
      }
      this.commandConfig[name].push(value);
    } else {
      this.commandConfig[name] = value;
    }
  }
}

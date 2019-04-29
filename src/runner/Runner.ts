import * as path from 'path';
import {Help} from '../help/help';
import {MissingCommandError} from '../parser/MissingCommandError';
import {Parser} from '../parser/Parser';
import {CommandDefinition, ManifestDefinition} from '../types/manifest';
import {InvalidFlagValueError} from './InvalidFlagValueError';
import {MissingOptionError} from './MissingOptionError';
import {MissingParamError} from './MissingOptionError.1';

export class Runner {
  private manifest: ManifestDefinition;
  private parser: Parser;
  private rootPath: string;
  private instance!: any;
  private commandConfig!: any;

  constructor(rootPath: string, manifest: ManifestDefinition) {
    this.rootPath = rootPath;
    this.manifest = manifest;
    this.parser = new Parser(manifest);
  }

  public run() {
    try {
      const {command, commandConfig} = this.parser.parse();
      this.commandConfig = commandConfig;

      this.instantiateCommand(command);
      this.configureCommand(command);

      this.instance[command.command]();
    } catch (e) {
      if (e instanceof MissingCommandError) {
        this.showHelp();
      } else {
        throw e;
      }
    }
  }

  private showHelp() {
    const help = new Help(this.manifest);
    help.show();
  }

  private instantiateCommand(command: CommandDefinition) {
    this.instance = new (require(path.join(this.rootPath, command.path))[command.className])();
  }

  private configureCommand(command: CommandDefinition) {
    const config = this.commandConfig;
    command.flags.forEach((flag) => {
      const value = config[flag.name] || flag.defaultValue;
      if (value) {
        const booleanValue = ['t', 'true'].includes(value);
        if (!booleanValue && !['f', 'false'].includes(value)) {
          throw new InvalidFlagValueError(flag.name, value);
        }
        this.instance[flag.name] = booleanValue;
      } else if (!flag.invertible) {
        this.instance[flag.name] = false;
      }
    });

    command.options.forEach((option) => {
      const value = config[option.name] || option.defaultValue;
      if (value) {
        this.instance[option.name] = value;
      } else if (!option.optional) {
        throw new MissingOptionError(option.name);
      }
    });

    command.params.forEach((param) => {
      const value = config[param.name] || param.defaultValue;
      if (value) {
        this.instance[param.name] = value;
      } else if (!param.optional) {
        throw new MissingParamError(param.name);
      }
    });
  }
}

import * as path from 'path';
import {Help} from '../help/help';
import {Parser} from '../parser/Parser';
import {CommandDefinition, ManifestDefinition} from '../types/manifest';
import './ErrorHandler';
import {InvalidFlagValueError} from './InvalidFlagValueError';
import {MissingOptionError} from './MissingOptionError';
import {MissingParamError} from './MissingParamError';
import {MissingCommandError} from '../parser';

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
    if (this.isHelp()) {
      this.showHelp(process.argv.slice(2, -1));
    } else {
      this.runCommand();
    }
  }

  private isHelp(): boolean {
    const last = process.argv[process.argv.length - 1];
    return last === '-h' || last === '--help';
  }

  private showHelp(query?: string[]) {
    new Help(this.manifest).show(query);
  }

  private runCommand() {
    try {
      const {command, commandConfig} = this.parser.parse();
      this.commandConfig = commandConfig;

      this.instantiateCommand(command);
      this.configureCommand(command);

      this.instance[command.key]();
    } catch (e) {
      if (e instanceof MissingCommandError) {
        this.showHelp();
        return;
      }
      throw e;
    }
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
        this.instance[flag.key] = booleanValue;
      } else if (!flag.invertible) {
        this.instance[flag.key] = false;
      }
    });

    command.options.forEach((option) => {
      const value = config[option.name] || option.defaultValue;
      if (value) {
        this.instance[option.key] = value;
      } else if (!option.optional) {
        throw new MissingOptionError(option.name);
      }
    });

    command.params.forEach((param) => {
      const value = config[param.name] || param.defaultValue;
      if (value) {
        this.instance[param.key] = value;
      } else if (!param.optional) {
        throw new MissingParamError(param.name);
      }
    });
  }
}

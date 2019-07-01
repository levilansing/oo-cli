import chalk from 'chalk';
import * as columnify from 'columnify';
import * as windowSize from 'window-size';
import {MissingCommandError} from '../parser';
import {Parser} from '../parser/Parser';
import {CommandDefinition, FlagDefinition, ManifestDefinition, OptionDefinition, ParamDefinition} from '../types/manifest';
import {EMPTY_PACKAGE} from '../types/manifestDefaults';

export class Help {
  private manifest: ManifestDefinition;
  private namespace?: string[];
  private executable!: string;
  constructor(manifest: ManifestDefinition) {
    this.manifest = manifest;
  }

  public show(commandChain: string[] = []) {
    const {name, version, license, executable} = this.manifest.package || EMPTY_PACKAGE;
    this.executable = executable || name || '<executable>';
    console.log(chalk.gray(`${name}  ${version}  (${license})`));

    if (commandChain.length > 0) {
      const parser = new Parser(this.manifest);
      try {
        parser.parse([...commandChain]);
      } catch (e) {
        if (!(e instanceof MissingCommandError)) {
          throw e;
        }
      }
      this.namespace = parser.namespace;

      if (parser.command) {
        this.showUsage(parser.command);
        this.listParams(parser.command.params);
        this.listFlags(parser.command.flags);
        this.listOptions(parser.command.options);
        return;
      } else {
        // fall through and show help for this namespace
        this.manifest = parser.manifest;
      }
    }

    // general help
    let options: Partial<CommandDefinition> = this.manifest.commands[0] || {};
    if (this.manifest.commands.length > 1) {
      options = this.getCommonOptions(this.manifest.commands);
    }

    this.showUsage(options);

    if (options.help) {
      console.log(options.help);
    }

    this.listNamespaces();
    this.listCommands(this.manifest.commands);

    this.listParams(options.params);
    this.listFlags(options.flags);
    this.listOptions(options.options);

    if (this.manifest.commands.length > 1) {
      console.log(chalk.gray(`\n${executable} help <command> for help on specific commands`));
    }
  }

  private showUsage(command: Partial<CommandDefinition>) {
    const cmdParts: string[] = [];

    // '' signifies a root command
    if (command.command !== '') {
      cmdParts.push(command.command || '<command>');
    }

    (command.params || []).forEach((param) => {
      cmdParts.push(param.optional ? `[<${param.name}>]` : `<${param.name}>`);
    });

    (command.flags || []).map((flag) => {
      const option = [flag.name, ...flag.aliases, ...flag.invertedAliases].map((f) => (
        f.length === 1 ? `-${f}` : `--${f}`
      )).join(' | ');
      cmdParts.push(`[${option}]`);
    });

    // optional options
    (command.options || [])
      .filter((o) => o.optional)
      .forEach((option) => {
        cmdParts.push(`[--${option.name}=<${option.name}>]`);
      });

    // required options
    (command.options || [])
      .filter((o) => !o.optional)
      .forEach((option) => {
        cmdParts.push(`--${option.name}=<${option.name}>`);
      });

    // Format the output so that we don't word wrap in the middle of an option if possible
    let line = `Usage: ${[this.executable, ...(this.namespace || [])].join(' ')} `;
    const indentation = ' '.repeat(line.length);
    const width = windowSize.get().width - line.length;
    line += cmdParts.shift();
    for (const part of cmdParts) {
      if (line.length + 1 + part.length > width) {
        console.log(line);
        line = indentation + part;
      } else {
        line += ` ${part}`;
      }
    }
    console.log(line);
  }

  private listNamespaces() {
    if (Object.keys(this.manifest.namespaces).length > 0) {
      const help: {[name: string]: string} = {};
      Object.keys(this.manifest.namespaces)
        .sort((a, b) => a.localeCompare(b))
        .forEach((n) => (
          help[n] = chalk.gray(this.manifest.namespaces[n].help || '')
        ));

      console.log(`\n${chalk.bold('Namespaces')}: ${chalk.gray('(`help <namespace>` for additional help)')}`);
      console.log(columnify(help, {showHeaders: false, columnSplitter: '   '}).replace(/(^|\n)/g, '$1  '));
    }
  }

  private listCommands(commands?: CommandDefinition[]) {
    if (commands && commands.length > 0) {
      const help: {[name: string]: string} = {};
      commands.forEach((c) => (
        help[[c.command, ...c.aliases].join(', ')] = chalk.gray(c.help)
      ));

      console.log(`\n${chalk.bold('Commands')}:`);
      console.log(columnify(help, {showHeaders: false, columnSplitter: '   '}).replace(/(^|\n)/g, '$1  '));
    }
  }

  private listParams(params?: ParamDefinition[]) {
    if (params && params.length > 0) {
      const help: {[name: string]: string} = {};
      params.forEach((p) => (
        help[p.name] = chalk.gray(p.help)
      ));

      console.log(`\n${chalk.bold('Parameters')}:`);
      console.log(columnify(help, {showHeaders: false, columnSplitter: '   '}).replace(/(^|\n)/g, '$1  '));
    }
  }

  private listFlags(flags?: FlagDefinition[]) {
    if (flags && flags.length > 0) {
      const help: {[name: string]: string} = {};
      flags.forEach((f) => {
        const label = [
          [f.name, ...f.aliases].map(this.formatFlag).join(', '),
          f.invertedAliases.map(this.formatFlag).join(', ')
        ].join('\n');
        help[label] = chalk.gray(f.help);
      });

      console.log(`\n${chalk.bold('Flags')}:`);
      console.log(columnify(help, {showHeaders: false, columnSplitter: '   '}).replace(/(^|\n)/g, '$1  '));
    }
  }

  private listOptions(options?: OptionDefinition[]) {
    if (options && options.length > 0) {
      const help: {[name: string]: string} = {};
      options.forEach((o) => (
        help[[o.name, ...o.aliases].map(this.formatFlag).join(', ')] = chalk.gray(o.help)
      ));

      console.log(`\n${chalk.bold('Options')}:`);
      console.log(columnify(help, {showHeaders: false, columnSplitter: '   '}).replace(/(^|\n)/g, '$1  '));
    }
  }

  private formatFlag(name?: string) {
    if (!name) {
      return '';
    }
    return name.length > 1 ? `--${name}` : `-${name}`;
  }

  private getCommonOptions(commands: CommandDefinition[]): Partial<CommandDefinition> {
    if (commands.length === 1) {
      return commands[0];
    }

    const flags: FlagDefinition[][] = [];
    const options: OptionDefinition[][] = [];
    const params: ParamDefinition[][] = [];
    commands.forEach((command) => {
      flags.push(command.flags);
      options.push(command.options);
      params.push(command.params);
    });

    const combinedFlags: FlagDefinition[] = [];
    if (flags.length > 0) {
      flags[0].forEach((source) => {
        const every = flags.every((flagList) => !!flagList.find((f) => (
          source.name === f.name && source.invertible === f.invertible && source.help === f.help
        )));
        if (every) {
          combinedFlags.push(source);
        }
      });
    }

    const combinedOptions: OptionDefinition[] = [];
    if (options.length > 0) {
      options[0].forEach((source) => {
        const every = options.every((flagList) => !!flagList.find((o) => (
          source.name === o.name && source.optional === o.optional
          && source.multiple === o.multiple && source.help === o.help
        )));
        if (every) {
          combinedOptions.push(source);
        }
      });
    }

    const combinedParams: ParamDefinition[] = [];
    if (params.length > 0) {
      params[0].forEach((source) => {
        const every = params.every((flagList) => !!flagList.find((p) => (
          source.name === p.name && source.optional === p.optional
          && source.multiple === p.multiple && source.help === p.help
        )));
        if (every) {
          combinedParams.push(source);
        }
      });
    }

    return {
      flags: combinedFlags,
      options: combinedOptions,
      params: combinedParams
    };
  }
}

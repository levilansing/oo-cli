# OO-CLI

A Typescript-first, object-oriented CLI framework. Build your own CLI by simply decorating some classes.

# WARNING

Version 0 is unstable. Expect breaking changes until it reaches 1.0.0

# Getting Started (new project)

Install oo-cli globally using [yarn](https://yarnpkg.com/en/package/jest):

```bash
yarn global add oo-cli
```

Or [npm](https://www.npmjs.com/):

```bash
npm install --global oo-cli
```

Then run
```bash
oo-cli init
```
**(NOT YET IMPLEMENTED)**
to scaffold a new project or `oo-cli help` for help on other commands.

# Adding to an existing project

TODO

# Example Command

Simply decorate your class to define your command, flags, options, and parameters and oo-cli will do the rest.

```typescript
import { command, flag, help, invertible, multiple, optional, param } from '../../decorators';

export class StatusCommand {
  @flag('l')
  @help('Include lights')
  @invertible
  public lights?: boolean;

  @flag('d')
  @help('Include doors')
  @invertible
  public doors?: boolean;

  @flag('v')
  @help('Show detailed status information')
  public verbose!: boolean;

  @param
  @help('Specify name(s) of devices to check their status')
  @optional
  @multiple
  public devices?: string[];

  @command
  @help('Get the status of all smart devices')
  public status() {
    // TBD
  }
}
```

Then build and run your command:

```bash
yarn build && yarn link
smart-house status -l kitchen
```

# Decorators

## Class decorators
| Decorator                         | Description                                                                                                                                                                           |
|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|      @namespace('namespace')      | Space delimited namespace to put this command under. Only necessary if you want to use namespaces.                                                                                    |

## Member variable decorators

| Decorator                         | Description                                                                                                                                                                           |
|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| @flag \| @flag('alias', ...)      | Mark this member variable as a flag (boolean). Optionally add additional aliases for the flag.                                                                                        |
| @invertible                       | Allows the flag to be inverted with opposite case for a single character alias or prefixed with `no-` for longer aliases. E.g., -c, --color => -C, --no-color.                        |
| @required                         | Mark a flag required (useful for invertible flags).                                                                                                                                   |
| @help('Explanation ...')          | Add help text to a flag, option, parameter, or command for the generated documentation.                                                                                               |
| @option \| @option('alias', ...)  | Mark this member variable as an option that can receive a string value from the command. E.g., --option=value.                                                                        |
| @optional                         | Mark an option, or parameter as not required.                                                                                                                                         |
| @multiple                         | Allow multiple values for an option or parameter (data type will be a string array)                                                                                                   |
| @defaultValue                     | Specify the default value if the option or parameter is optional and not provided.                                                                                                    |
| @param \| @param('name')          | Mark this member variable as a parameter for the command. Parameters must be in the expected order in the class. The optional name will override the param name in the documentation. |

## Member function decorators

| Decorator                         | Description                                                                                                                                                                           |
|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| @command \| @command('alias', ...)| Tells oo-cli to instantiate this class and call this function when the command is executed.                                                                                           |

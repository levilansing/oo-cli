import {FlagDefinition, OptionDefinition, PackageDefinition, ParamDefinition} from './manifest';

export const FLAG_DEFAULTS: FlagDefinition = Object.freeze({
  name: '',
  key: '',
  aliases: [],
  invertedAliases: [],
  help: '',
  defaultValue: false,
  invertible: false
});

export const OPTION_DEFAULTS: OptionDefinition = Object.freeze({
  name: '',
  key: '',
  aliases: [],
  help: '',
  defaultValue: undefined,
  optional: true,
  multiple: false
});

export const PARAM_DEFAULTS: ParamDefinition = Object.freeze({
  name: '',
  key: '',
  help: '',
  defaultValue: undefined,
  optional: false,
  multiple: false
});

export const EMPTY_PACKAGE: PackageDefinition = Object.freeze({
  name: '',
  version: '',
  license: 'unknown license',
  executable: ''
});

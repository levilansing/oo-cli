import {FlagDefinition, OptionDefinition, ParamDefinition} from './manifest';

export const FLAG_DEFAULTS: FlagDefinition = Object.freeze({
  name: '',
  aliases: [],
  invertedAliases: [],
  help: '',
  defaultValue: false,
  invertable: false
});

export const OPTION_DEFAULTS: OptionDefinition = Object.freeze({
  name: '',
  aliases: [],
  help: '',
  defaultValue: undefined,
  optional: true,
  multiple: false
});

export const PARAM_DEFAULTS: ParamDefinition = Object.freeze({
  name: '',
  help: '',
  defaultValue: undefined,
  optional: false,
  multiple: false
});

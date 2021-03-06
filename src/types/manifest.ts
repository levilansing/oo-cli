export interface ManifestDefinition {
  package?: PackageDefinition;
  namespaces: {
    [namespace: string]: ManifestDefinition;
  };
  commands: CommandDefinition[];
  help?: string;
}

export interface PackageDefinition {
  version: string;
  name: string;
  executable: string;
  license: string;
}

export interface CommandDefinition {
  path: string;
  className: string;
  key: string;
  command: string;
  aliases: string[];
  help: string;
  documentation: string;
  flags: FlagDefinition[];
  options: OptionDefinition[];
  params: ParamDefinition[];
}

export interface FlagDefinition {
  name: string;
  key: string;
  aliases: string[];
  invertedAliases: string[];
  help: string;
  defaultValue?: boolean;
  invertible: boolean;
}

export interface OptionDefinition {
  name: string;
  key: string;
  aliases: string[];
  help: string;
  defaultValue?: string;
  optional: boolean;
  multiple: boolean;
}

export interface ParamDefinition {
  name: string;
  key: string;
  help: string;
  defaultValue?: string;
  optional: boolean;
  multiple: boolean;
}

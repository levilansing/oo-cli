export interface OoCliConfig {
  basePath: string;
  search: string[];
  manifestPath: string;
  include: string;
  exclude: string;
}

export const DEFAULT_CONFIG: OoCliConfig = Object.freeze({
  basePath: 'dist/',
  search: ['**/*'],
  manifestPath: '',
  include: '\\.[tj]s$',
  exclude: '[\\\/](tests?|specs?)[\\\/]|\\.(test|spec)\\.[^\\\/]+$|\\.d\\.ts$'
});

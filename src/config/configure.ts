import {DEFAULT_CONFIG, OoCliConfig} from './OoCliConfig';

export const ooCliConfig: OoCliConfig = Object.assign({}, DEFAULT_CONFIG);

export function configure(config: Partial<OoCliConfig>) {
  Object.assign(ooCliConfig, config);
}

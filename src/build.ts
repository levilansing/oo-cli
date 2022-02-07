import * as fs from 'fs';
import * as path from 'path';
import {buildManifest} from './build/buildManifest';
import {configure, ooCliConfig} from './config/configure';

const inProduction = process.env.NODE_ENV === 'production' || ['-p', '--production'].includes(process.argv[2]);

const rootPath = process.cwd();
let {basePath} = ooCliConfig;
if (!path.isAbsolute(basePath)) {
  basePath = path.join(rootPath, basePath);
}
configure({basePath});

const configPath = [
  path.join(basePath, 'oo-cli.config.json'),
  path.join(rootPath, 'oo-cli.config.json')
].find((p) => fs.existsSync(p));

if (configPath) {
  // tslint:disable-next-line:no-var-requires
  const config = require(configPath);
  if (config.basePath) {
    if (!path.isAbsolute(config.basePath)) {
      config.basePath = path.join(rootPath, config.basePath);
    }
  }
  configure(config);

  // TODO: validate config
}

console.log('Building manifest from source files...');
const manifestPath = path.join(basePath, ooCliConfig.manifestPath, 'oo-cli.manifest.json');
const manifest = buildManifest(ooCliConfig, path.dirname(manifestPath));

// populate manifest with package information
// tslint:disable-next-line:no-var-requires
const {version, name, license, bin} = require(path.join(rootPath, 'package.json'));
manifest.package = {version, name, license, executable: Object.keys(bin || {})[0] || name};

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, inProduction ? 0 : 2));
console.log(`Wrote manifest to ${manifestPath}`);

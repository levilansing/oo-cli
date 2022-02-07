import * as path from 'path';
import {OoCliConfig} from '../config/OoCliConfig';
import {Manifest} from '../manifest/Manifest';
import {ManifestDefinition} from '../types/manifest';
import glob = require('glob');

export function buildManifest(config: OoCliConfig, basePath: string): ManifestDefinition {
  const includeRegex = new RegExp(config.include);
  const excludeRegex = new RegExp(config.exclude);

  config.search.forEach((pattern) => {
    let searchPath = pattern;
    if (!path.isAbsolute(searchPath)) {
      searchPath = path.join(config.basePath, searchPath);
    }
    if (!path.isAbsolute(searchPath)) {
      searchPath = path.join(process.cwd(), searchPath);
    }
    glob.sync(searchPath)
      .filter((file) => includeRegex.test(file) && !excludeRegex.test(file))
      .forEach((file) => require(file));
  });

  return Manifest.compileManifest(basePath);
}

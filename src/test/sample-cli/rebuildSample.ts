#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import {buildManifest} from '../../build/buildManifest';
import {DEFAULT_CONFIG} from '../../config/OoCliConfig';

const manifest = buildManifest(Object.assign(
  {}, DEFAULT_CONFIG, {basePath: __dirname, search: ['**/*'], exclude: '^$'}
), __dirname);

const outputFile = path.resolve(__dirname, './oo-cli.manifest.json');
fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 2));
console.log(`Wrote out ${outputFile}`);

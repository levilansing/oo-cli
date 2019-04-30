#!/usr/bin/env node

import * as path from 'path';
import {Runner} from './runner/Runner';

// tslint:disable-next-line:no-var-requires
const manifest = require(path.join(__dirname, './oo-cli.manifest.json'));

new Runner(__dirname, manifest).run();

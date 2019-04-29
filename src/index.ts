#!/usr/bin/env node

import './runner/ErrorHandler';
import {Runner} from './runner/Runner';

// tslint:disable-next-line:no-var-requires
const manifest = require('./oo-cli.manifest.json');

new Runner(__dirname, manifest).run();

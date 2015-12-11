#!/usr/bin/env node

'use strict';

var fs = require('fs')
	, path = require('path')
	, chalk = require('chalk')
	, meow = require('meow')
	, pkg = require('../package.json');

var cli = meow({
	help: [
		'Usage',
		'  $ borscht',
		'',
		'Options',
		'  --run     Run script after building bundle',
		'  --output  Specify output file directory',
		'  --watch   Watch for changes in required files and rebuild on the fly',
		'',
		'version: ' + pkg.version
	]
});

/**
 * [initialize description]
 * @return {[type]} [description]
 */
function initialize() {
	if (cli.flags.run) {
		console.log('exec script');
	}

}

initialize();

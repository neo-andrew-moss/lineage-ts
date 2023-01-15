#!/usr/bin/env node

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import {Command} from 'commander';

import pkg from '../package.json';
import {lineage} from './lineage';

const program = new Command();

clear();
console.log(
	chalk.redBright(figlet.textSync(pkg.name, {horizontalLayout: 'full'})),
);

program
	.version(pkg.version)
	.description(pkg.description)
	.requiredOption('-f, --file <string>', 'entrypoint filepath')
	.option("-tsc, --tsconfig <string>, 'tsconfig.json filepath")
	.option("-dir, --destDir <string>, 'destination filepath")
	.option("-dbg, --debug <boolean>, 'turn on debug mode")
	.parse(process.argv);

const options = program.opts();

program.parse();

console.log('opts');
console.log(options);

lineage(options.file,options.tsconfig, options.destDir);

if (!process.argv.slice(2).length) {
	program.outputHelp();
}

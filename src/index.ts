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
	.description('descendan-ts')
	.requiredOption('-f, --file <string>', 'entrypoint filepath')
	.parse(process.argv);

const options = program.opts();

program.parse();

console.log('opts');
console.log(options);

lineage(options.file);

if (!process.argv.slice(2).length) {
	program.outputHelp();
}

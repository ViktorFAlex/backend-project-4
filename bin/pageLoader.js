#!/usr/bin/env node
import { program } from 'commander';
import loadPage from '../src/index.js';
import handleError from '../src/handleError.js';

program
  .name('page-loader')
  .version('1.0.0', '-V, --version', 'output the current version')
  .description('Download content from webpage and save it as assets.')
  .helpOption('-h, --help', 'output help message')
  .option('-o, --output [dir]', `output dir (default: '${process.cwd()}')`)
  .argument('<url>')
  .action((url) => {
    loadPage(url, program.opts().output)
      .then(() => console.log('Done!'))
      .catch((e) => {
        handleError(e);
        process.exit(1);
      });
  });

program.parse();

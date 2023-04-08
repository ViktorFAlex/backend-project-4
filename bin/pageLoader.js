#!/usr/bin/env node
import { program } from 'commander';
import path from 'path';
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
    const outputDir = path.join(process.cwd(), program.opts().output || '');
    loadPage(url, outputDir)
      .then(() => console.log('Done!'))
      .catch((e) => {
        handleError(e);
        process.exit(1);
      });
  });

program.parse();

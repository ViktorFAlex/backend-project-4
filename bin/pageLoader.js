#!/usr/bin/env node
import { program } from 'commander';
import axios from 'axios';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

program
  .name('page-loader')
  .version('1.0.0', '-V, --version', 'output the current version')
  .description('Download content from webpage and save it as assets.')
  .helpOption('-h, --help', 'output help message')
  .option('-o, --output [dir]', `output dir (default: '${__dirname}')`, `${__dirname}`)
  .argument('<url>')
  .action((url) => {
    const outputDir = program.opts().output;

    const fileName = url
      .replace(/(http|https):\/\//, '')
      .replace(/[^a-zA-Z\d]/g, '-')
      .replace(/\b$/, '.html');

    axios.get(url).then((response) => {
      const dirPath = path.join(__dirname, outputDir);
      const filePath = path.join(dirPath, fileName);
      fs.mkdir(path.join(__dirname, outputDir), { recursive: true })
        .then(() => fs.writeFile(filePath, response.data))
        .then(() => console.log('Done!'));
    });
  });

program.parse();

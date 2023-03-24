import { test, expect, beforeEach } from '@jest/globals';
import nock from 'nock';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import os from 'os';
import loadPage from '../src/index.js';
import buildFileName from '../src/helpers/buildFileName.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFile(getFixturePath(filename), 'utf-8');

let tmpDirPath;

beforeEach(async () => {
  const dirPath = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  tmpDirPath = path.join(dirPath);
});

test('loadPageContent', async () => {
  const url = 'https://page-loader.hexlet.repl.co/';
  const fileName = buildFileName(url);
  const fixtureFileName = fileName.replace(/html/, 'txt');
  await fs.readFile(getFixturePath(fixtureFileName), 'utf-8');
  const data = await readFile(fixtureFileName);

  nock(url).get('/').reply(200, data);

  await loadPage(url, path.join(tmpDirPath));

  const fileData = await fs.readFile(path.join(tmpDirPath, fileName), 'utf-8');
  expect(fileData).toStrictEqual(data);
});

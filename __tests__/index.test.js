import {
  test, expect, beforeEach, describe,
} from '@jest/globals';
import nock from 'nock';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdtemp, readdir, readFile } from 'fs/promises';
import os from 'os';
import loadPage from '../src/index.js';
import buildFileName from '../src/helpers/buildFileName.js';
import routes from '../__fixtures__/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFixtureFile = (filename, encoding = 'utf-8') =>
  readFile(getFixturePath(filename), encoding);

describe('loadPageContent', () => {
  let tmpDirPath;

  beforeEach(async () => {
    const dirPath = await mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
    tmpDirPath = dirPath;
  });

  test('loadPageContent', async () => {
    const {
      url, imgFileName, imgFolderName, expectedHtmlFilePath, expectedImgSrc,
    } = routes;

    const fileName = buildFileName(url);
    const fixtureFileName = fileName.replace(/html/, 'txt');

    const pageData = await readFixtureFile(fixtureFileName);
    const imgData = await readFixtureFile(imgFileName, 'base64');

    nock(url)
      .get(expectedImgSrc)
      .reply(200, imgData)
      .get('/')
      .reply(200, pageData);
    await loadPage(routes.url, tmpDirPath);

    const testCasesPromises = [
      readFixtureFile(expectedHtmlFilePath),
      readdir(tmpDirPath),
      readdir(path.join(tmpDirPath, imgFolderName)),
      readFile(path.join(tmpDirPath, fileName), 'utf-8'),
    ];

    const [
      expectedHtml, filesFolder, imageFolder, actualHtml,
    ] = await Promise.all(testCasesPromises);

    expect(filesFolder).toHaveLength(2);
    expect(filesFolder).toContain(fileName, imgFolderName);
    expect(imageFolder).toContain(imgFileName);
    expect(actualHtml).toStrictEqual(expectedHtml);
  });
});

import {
  test, expect, beforeEach, describe, it,
} from '@jest/globals';
import nock from 'nock';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  mkdtemp, access, readFile,
} from 'fs/promises';
import os from 'os';
import loadPage from '../src/index.js';
import buildFileName from '../src/helpers/buildFileName.js';
import routes from '../__fixtures__/routes.js';
import fileNames from '../__fixtures__/fileNames.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFixtureFile = (filename, encoding = 'utf-8') =>
  readFile(getFixturePath(filename), encoding);

let tmpDirPath;

beforeEach(async () => {
  tmpDirPath = await mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

describe('loadPageContent', () => {
  it('preparingWorkingDirectory', async () => {
    const {
      url, result, assets,
    } = routes;

    const promises = assets.map(({
      fixture, assetUrl, encoding, resultUrl,
    }) =>
      readFixtureFile(fixture, encoding).then((data) => {
        nock(url).get((uri) => uri.includes(assetUrl)).reply(200, data);
        return {
          before: data,
          after: null,
          resultUrl,
          assetUrl,
        };
      }));
    const expectedFilesData = await Promise.all(promises);

    await loadPage(url, tmpDirPath);
    const expectedHtml = await readFixtureFile(result, 'utf-8');
    const rootHtmlData = expectedFilesData.find(({ assetUrl }) => assetUrl === '/');
    const loadedHtml = await readFile(
      path.join(tmpDirPath, rootHtmlData.resultUrl),
      'utf-8',
    );
    expect(expectedHtml).toEqual(loadedHtml);
    expectedFilesData.forEach(async ({ resultUrl }) => {
      await expect(access(path.join(tmpDirPath, resultUrl))).resolves.not.toThrow();
    });
  });
});

describe('buildRoutePaths', () => {
  test.each(fileNames)('generateFileNames', ({ before, ext, after }) => {
    expect(after).toBe(buildFileName(before, ext));
  });
});

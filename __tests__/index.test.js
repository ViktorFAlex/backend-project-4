import {
  test, expect, beforeEach, describe, it, jest,
} from '@jest/globals';
import nock from 'nock';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import os from 'os';
import loadPage from '../src/index.js';
import buildFileName from '../src/fileHandlers/buildFileName.js';
import routes from '../__fixtures__/routes.js';
import fileNames from '../__fixtures__/fileNames.js';
import handleError from '../src/handleError.js';
import handleFsError from '../src/helpers/handleFsError.js';
import handleAxiosError from '../src/helpers/handleAxiosError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFixtureFile = (filename, encoding = 'utf-8') =>
  fs.readFile(getFixturePath(filename), encoding);

describe('loadPageContent', () => {
  let tmpDirPath;
  const { url, result, assets } = routes;
  let expectedFilesData;

  beforeEach(async () => {
    tmpDirPath = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
    const promises = assets.map(({
      fixture, assetUrl, encoding, resultUrl,
    }) =>
      readFixtureFile(fixture, encoding).then((data) => {
        nock(url)
          .get((uri) => uri.includes(assetUrl))
          .reply(200, data);
        return {
          before: data,
          after: null,
          resultUrl,
          assetUrl,
        };
      }));

    expectedFilesData = await Promise.all(promises);
  });

  it('test expected function result', async () => {
    await loadPage(url, tmpDirPath);
    const expectedHtml = await readFixtureFile(result, 'utf-8');
    const rootHtmlData = expectedFilesData.find(({ assetUrl }) => assetUrl === '/');
    const loadedHtml = await fs.readFile(
      path.join(tmpDirPath, rootHtmlData.resultUrl),
      'utf-8',
    );
    expect(expectedHtml).toEqual(loadedHtml);
    expectedFilesData.forEach(async ({ resultUrl }) => {
      await expect(fs.access(path.join(tmpDirPath, resultUrl))).resolves.not.toThrow();
    });
  });

  it('test function rejects with fsError', async () => {
    await fs.chmod(tmpDirPath, 0);
    await expect(loadPage(url, tmpDirPath)).rejects.toThrow();
  });

  it('test function rejects with axios error', async () => {
    await expect(loadPage('non-existant url', tmpDirPath)).rejects.toThrow();
  });
});

describe('buildRoutePaths', () => {
  test.each(fileNames)('generateFileNames', ({ before, ext, after }) => {
    expect(after).toBe(buildFileName(before, ext));
  });
});

describe('check error handlers', () => {
  it('check fs error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const newError = new Error('Error');
    newError.code = 'EACCES';
    handleFsError(newError);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith('There was an Error: permission denied');
    consoleSpy.mockRestore();
  });

  it('check axios error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const newError = new Error('Error');
    handleAxiosError(newError);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith('Server responded with error 404: Not Found!');
    const response = { status: 404 };
    newError.response = response;
    handleAxiosError(newError);
    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(consoleSpy).toHaveBeenCalledWith('Server responded with error 404: Not Found!');
    consoleSpy.mockRestore();
  });

  it('check global function for errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const newAxiosError = new Error('Error');
    const newFsError = new Error('Error');
    newAxiosError.isAxiosError = true;
    newFsError.code = 'EACCES';
    handleError(newAxiosError);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith('Server responded with error 404: Not Found!');
    handleError(newFsError);
    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(consoleSpy).toHaveBeenCalledWith('There was an Error: permission denied');
    consoleSpy.mockRestore();
  });
});

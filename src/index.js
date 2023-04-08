import axios from 'axios';
import debug from 'debug';
import { Spinner } from '@topcli/spinner';
import path from 'path';
import fs from 'fs/promises';
import buildFileName from './fileHandlers/buildFileName.js';
import manipulateDomLinks from './fileHandlers/manipulateDomLinks.js';
import typeHandlers from './helpers/typeHandlers.js';
import axiosDebugger from '../debuggers/axiosDebugger.js';

const appLog = debug('page-loader');

const loadPage = (url, dirPath) => {
  if (process.env.DEBUG === 'axios') {
    axiosDebugger(axios, debug);
  }
  const fileName = buildFileName(url, '.html');
  const htmlFilePath = path.join(dirPath, fileName);

  return axios
    .get(url)
    .then((response) => {
      const { href } = new URL(url);
      const folderName = buildFileName(href, '_files');
      const folderPath = path.join(dirPath, folderName);
      const [$, promises] = manipulateDomLinks(response.data, url, folderName, folderPath);
      appLog($, promises);

      return fs
        .mkdir(folderPath, { recursive: true })
        .then(() => {
          appLog(`Folder created at ${folderPath}`);
          return fs.writeFile(htmlFilePath, $.html());
        })
        .then(() => {
          const spinners = promises.map(({ fileUrl, filePath, type }) => {
            const spinner = new Spinner().start(`${fileUrl}`);
            appLog(`Creating file ${filePath} from ${fileUrl}`);
            return axios
              .get(fileUrl, { responseType: typeHandlers.get(type).responseType })
              .then(({ data }) => fs.writeFile(filePath, data))
              .catch((error) => {
                throw (error);
              })
              .finally(() => spinner.succeed(
                `${fileUrl} done in ${parseInt(spinner.elapsedTime) / 1000} sec`,
              ));
          });
          return Promise.all(spinners);
        })
        .catch((error) => {
          throw (error);
        });
    })
    .catch((error) => {
      throw (error);
    });
};

export default loadPage;

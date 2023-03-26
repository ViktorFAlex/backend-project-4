import axios from 'axios';
import path from 'path';
import fs from 'fs/promises';
import buildFileName from './helpers/buildFileName.js';
import manipulateDomLinks from './helpers/manipulateDomLinks.js';
import typeHandlers from './helpers/typeHandlers.js';

const loadPage = (url, dirPath) => {
  const fileName = buildFileName(url, '.html');
  const htmlFilePath = path.join(dirPath, fileName);
  return axios.get(url).then((response) => {
    const folderName = buildFileName(url, '_files');
    const folderPath = path.join(dirPath, folderName);
    const [$, promises] = manipulateDomLinks(response.data, url, folderName, folderPath);

    return fs
      .mkdir(folderPath, { recursive: true })
      .then(() => fs.writeFile(htmlFilePath, $.html())
        .then(() => Promise.all(
          promises.map(({ fileUrl, filePath, type }) =>
            axios.get(fileUrl, { responseType: typeHandlers.get(type).responseType })
              .then(({ data }) => fs.writeFile(filePath, data))),
        )));
  });
};

export default loadPage;

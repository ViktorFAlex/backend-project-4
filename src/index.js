import axios from 'axios';
import path from 'path';
import fs from 'fs/promises';
import buildFileName from './helpers/buildFileName.js';
import manipulateDomLinks from './helpers/manipulateDomLinks.js';

const loadPage = (url, dirPath) => {
  const fileName = buildFileName(url);
  const filePath = path.join(dirPath, fileName);
  return axios.get(url).then((response) => {
    const imgFolderName = buildFileName(url, '_files');
    const imgFolderPath = path.join(dirPath, imgFolderName);
    const [$, imgPromises] = manipulateDomLinks(response.data, url, imgFolderName, imgFolderPath);

    return fs
      .mkdir(imgFolderPath, { recursive: true })
      .then(() => fs.writeFile(filePath, $.html())
        .then(() => Promise.all(
          imgPromises.map(({ imgUrl, imgPath }) =>
            axios.get(imgUrl, { responseType: 'arraybuffer' })
              .then(({ data }) => fs.writeFile(imgPath, data))),
        )));
  });
};

export default loadPage;

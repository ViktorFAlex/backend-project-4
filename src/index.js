import axios from 'axios';
import * as cheerio from 'cheerio';
import path from 'path';
import fs from 'fs/promises';
import buildFileName from './helpers/buildFileName.js';

const loadPage = (url, dirPath) => {
  const fileName = buildFileName(url);
  const filePath = path.join(dirPath, fileName);
  return axios.get(url).then((response) => {
    const $ = cheerio.load(response.data, { xmlMode: true, decodeEntities: false });
    const $imgs = $('img');
    const imgPromises = [];
    const { hostname } = new URL(url);
    const imgFolderName = buildFileName(url, '_files');
    const imgFolderPath = path.join(dirPath, imgFolderName);
    $imgs
      .toArray()
      .filter(({ attribs: { src } }) => /^\//.test(src))
      .forEach((element) => {
        const { attribs } = element;
        const { dir, name, ext } = path.parse(attribs.src);
        const imgFileName = buildFileName(path.join(hostname, dir, name), ext);
        const newSrc = path.join(imgFolderName, imgFileName);
        const imgUrl = new URL(attribs.src, url);
        const imgPath = path.join(imgFolderPath, imgFileName);
        imgPromises.push({ imgUrl, imgPath });
        attribs.src = newSrc;
      });
    return fs
      .mkdir(imgFolderPath, { recursive: true })
      .then(() =>
        fs
          .writeFile(filePath, $.html())
          .then(() =>
            Promise.all(
              imgPromises.map(({ imgUrl, imgPath }) =>
                axios
                  .get(imgUrl, { responseType: 'arraybuffer' })
                  .then(({ data }) => fs.writeFile(imgPath, data)),
              ),
            ),
          ),
      );
  });
};

export default loadPage;

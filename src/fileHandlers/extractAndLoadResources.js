/* eslint no-param-reassign: ["error", { "props": false }] */
import path from 'path';
import typeHandlers from '../helpers/typeHandlers.js';
import buildFileName from './buildFileName.js';

export default (nodes, url, type, folderName, folderPath) => {
  const { origin } = new URL(url);
  const imgPromises = [];
  const regex = new RegExp(`${origin}|^/`);
  const { routeType } = typeHandlers.get(type);
  nodes
    .toArray()
    .filter(({ attribs }) => regex.test(attribs[routeType]))
    .forEach(({ attribs }) => {
      attribs[routeType] = attribs[routeType].replace(origin, '');
      const { dir, name, ext } = path.parse(attribs[routeType]);
      const fileName = buildFileName(path.join(origin, dir, name), ext || '.html');
      const newSrc = path.join(folderName, fileName);

      const fileUrl = new URL(attribs[routeType], url);
      const filePath = path.join(folderPath, fileName);
      imgPromises.push({ fileUrl, filePath, type });
      attribs[routeType] = newSrc;
    });
  return imgPromises;
};

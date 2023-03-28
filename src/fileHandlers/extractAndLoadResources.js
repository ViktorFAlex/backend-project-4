import path from 'path';
import typeHandlers from '../helpers/typeHandlers.js';
import buildFileName from './buildFileName.js';

export default (nodes, url, type, folderName, folderPath) => {
  const { hostname } = new URL(url);
  const imgPromises = [];
  const regex = new RegExp(`${url}|^/`);
  const { routeType } = typeHandlers.get(type);
  nodes
    .toArray()
    .filter(({ attribs }) => regex.test(attribs[routeType]))
    .forEach(({ attribs }) => {
      const { dir, name, ext } = path.parse(attribs[routeType]);

      const fileName = buildFileName(path.join(hostname, dir, name), ext || '.html');
      const newSrc = path.join(folderName, fileName);

      const fileUrl = new URL(attribs[routeType], url);
      const filePath = path.join(folderPath, fileName);

      imgPromises.push({ fileUrl, filePath, type });
      attribs[routeType] = newSrc;
    });
  return imgPromises;
};

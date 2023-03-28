import * as cheerio from 'cheerio';
import extractAndLoadResources from './extractAndLoadResources.js';

export default (html, url, folderName, folderPath) => {
  const $ = cheerio.load(html, {
    xmlMode: true,
    decodeEntities: false,
  });

  const $imgs = $('img');
  const $links = $('link');
  const $scripts = $('script');
  const imgPromises = extractAndLoadResources($imgs, url, 'img', folderName, folderPath);
  const linksPromises = extractAndLoadResources($links, url, 'link', folderName, folderPath);
  const scriptsPromises = extractAndLoadResources($scripts, url, 'script', folderName, folderPath);
  const promises = [...imgPromises, ...linksPromises, ...scriptsPromises];

  return [$, promises];
};

import path from 'path';

const expectedAssetsFolderName = 'page-loader-hexlet-repl-co_files';

const routes = {
  url: 'https://page-loader.hexlet.repl.co/',
  result: 'result.txt',
  assets: [
    {
      fixture: 'page-loader-hexlet-repl-co-assets-professions-nodejs.png',
      assetUrl: '/assets/professions/nodejs.png',
      resultUrl: path.join(
        expectedAssetsFolderName,
        'page-loader-hexlet-repl-co-assets-professions-nodejs.png',
      ),
      encoding: 'base64',
    },
    {
      fixture: 'page-loader-hexlet-repl-co.txt',
      assetUrl: '/',
      encoding: 'utf-8',
      resultUrl: 'page-loader-hexlet-repl-co.html',
    },
    {
      fixture: 'page-loader-hexlet-repl-co-assets-application.txt',
      assetUrl: '/assets/application.css',
      resultUrl: path.join(
        expectedAssetsFolderName,
        'page-loader-hexlet-repl-co-assets-application.css',
      ),
      encoding: 'utf-8',
    },
    {
      fixture: 'page-loader-hexlet-repl-co-script.txt',
      assetUrl: '/script.js',
      encoding: 'utf-8',
      resultUrl: path.join(expectedAssetsFolderName, 'page-loader-hexlet-repl-co-script.js'),
    },
    {
      fixture: 'page-loader-hexlet-repl-co-script.txt',
      assetUrl: '/script2.js',
      encoding: 'utf-8',
      resultUrl: path.join(expectedAssetsFolderName, 'page-loader-hexlet-repl-co-script.js'),
    },
    {
      fixture: 'page-loader-hexlet-repl-co-courses.txt',
      assetUrl: '/courses',
      encoding: 'utf-8',
      resultUrl: path.join(expectedAssetsFolderName, 'page-loader-hexlet-repl-co-courses.html'),
    },
  ],
};

export default routes;

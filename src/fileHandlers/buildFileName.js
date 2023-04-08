export default (path, ext = '') => path
  .replace(/(http|https):(\/\/|\/)|\/$/g, '')
  .replace(/[^a-z\d]/gi, '-')
  .replace(/\b$/, ext);

export default (path, ext = '.html') =>
  path
    .replace(/(http|https):\/\/|\/$/g, '')
    .replace(/[^a-z\d]/gi, '-')
    .replace(/\b$/, ext);

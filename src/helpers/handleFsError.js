import errno from 'errno';

export default ({ code }) => {
  console.error(`There was an Error: ${errno.code[code].description}`);
  process.exit();
};

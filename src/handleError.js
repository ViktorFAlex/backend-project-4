import handleAxiosError from './helpers/handleAxiosError.js';
import handleFsError from './helpers/handleFsError.js';

export default (error) => {
  if (error.isAxiosError) {
    handleAxiosError(error);
  } else {
    handleFsError(error);
  }
};

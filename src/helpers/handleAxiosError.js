import httpCode from 'http-status-codes';

const getErrorMessage = (statusCode) => {
  const httpStatusText = httpCode.getStatusText(statusCode);
  return `Server responded with error ${statusCode}: ${httpStatusText}!`;
};

export default (error) => {
  if (error?.response?.status) {
    console.error(getErrorMessage(error.response.status));
  } else {
    console.error(getErrorMessage(404));
  }
};

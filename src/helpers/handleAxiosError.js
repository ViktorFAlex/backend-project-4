import httpCode from 'http-status-codes';

const getErrorMessage = (statusCode) =>
  `Server responded with error ${statusCode}: ${httpCode.getStatusText(statusCode)}!`;

export default (error) => {
  if (error?.response?.status) {
    console.error(getErrorMessage(error.response.status));
  } else {
    console.error(getErrorMessage(404));
  }
  process.exit();
};

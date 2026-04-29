export const getErrorMessage = (error) => {
  if (error.response && error.response.data) {
    return error.response.data;
  }
  if (error.message) {
    return error.message;
  }
  return "Unexpected error occurred";
};

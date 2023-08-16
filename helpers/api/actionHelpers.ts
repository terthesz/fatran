function actionStatus(isError: boolean, status?: any, message?: any) {
  const error_return = {
    isError: isError,
    status:
      (typeof status !== 'number' ? (isError ? 500 : 200) : status) || 500,
    message: message
      ? message
      : status && typeof status !== 'number'
      ? status
      : isError
      ? 'Unknown error.'
      : 'Success',
    code: null,
  };

  error_return.code = error_return.message
    .toLowerCase()
    .replaceAll(' ', '-')
    .replaceAll('.', '');

  return error_return;
}

export function actionError(status?: any, message?: any) {
  return actionStatus(true, status, message);
}

export function actionSuccess(status?: any, message?: any) {
  return actionStatus(false, status, message);
}

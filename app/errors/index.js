import { pick } from '../helpers/helperfunctions.helper';

const HttpStatus = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

const form = (errorDefault) => (customException) => ({
  ...errorDefault,
  ...pick(customException, ['identifier', 'code', 'type', 'meta', 'title', 'detail']),
});

export const notFound = form({
  status: HttpStatus.NOT_FOUND,
  title: 'Not Found',
  detail: '',
});
export const unauthorized = form({
  status: HttpStatus.UNAUTHORIZED,
  title: 'Unauthorized',
  detail: '',
});
export const badRequest = form({
  status: HttpStatus.BAD_REQUEST,
  title: 'Bad Request',
  detail: '',
});
export const internalServerError = form({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  title: 'Internal Server Error',
  detail: '',
});

export default {
  notFound,
  unauthorized,
  badRequest,
  internalServerError,
};

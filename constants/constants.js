module.exports = {
  response: {
    ok: {
      code: 1000,
      message: 'OK',
    },
    spam: {
      code: 9991,
      message: 'Spam',
    },
    productNotExist: {
      code: 9992,
      message: 'Product is not existed.',
    },
    codeVerifyIncorrect: {
      code: 9993,
      message: 'Code verify is incorrect.',
    },
    noDataOrEndListData: {
      code: 9994,
      message: 'No Data or end of list data.',
    },
    userInValid: {
      code: 9995,
      message: 'User is not validated.',
    },
    userExisted: {
      code: 9996,
      message: 'User existed.',
    },
    methodInvalid: {
      code: 9997,
      message: 'Method is invalid.',
    },
    tokenInvalid: {
      code: 9998,
      message: 'Token is invalid.',
    },
    exceptionError: {
      code: 9999,
      message: 'Exception error.',
    },
    cantConnectDB: {
      code: 1001,
      message: 'Can not connect to DB.',
    },
    paramNotEnough: {
      code: 1002,
      message: 'Parameter is not enough.',
    },
    paramTypeInvalid: {
      code: 1003,
      message: 'Parameter type is invalid.',
    },
    paramValueInvalid: {
      code: 1004,
      message: 'Parameter value is invalid.',
    },
    unknownError: {
      code: 1005,
      message: 'Unknown error.',
    },
    fileSizeBig: {
      code: 1006,
      message: 'File size is too big.',
    },
    uploadFileFail: {
      code: 1007,
      message: 'Upload File Failed!.',
    },
    maxNumberImage: {
      code: 1008,
      message: 'Maximum number of images.',
    },
    notAccess: {
      code: 1009,
      message: 'Not access.',
    },
    actionDonePreByUser: {
      code: 1010,
      message: 'action has been done previously by this user.',
    },
    productSolded: {
      code: 1011,
      message: 'The product has been sold.',
    },
    addressNotSupportShipping: {
      code: 1012,
      message: 'Address does not support Shipping.',
    },
    urlUserNotExist: {
      code: 1013,
      message: 'Url User\'s is exist.',
    },
    promoCodeExpired: {
      code: 1014,
      message: 'Promotional code expired.',
    },
    wrongPassword: {
      code: 1015,
      message: 'Password is not valid with user',
    },
    systemError: {
      code: 1016,
      message: 'System have an error',
    },
    userNotFound: {
      code: 1017,
      message: 'Not found user in system',
    },
    campaignNotFound: {
      code: 1018,
      message: 'Not found campaigns in system',
    },
  },
  systemErrorResponse: {
    code: 1016,
    message: 'System have an error',
    data: null,
  },
  userNotFoundResponse: {
    code: 1017,
    message: 'Not found user in system',
    data: null,
  },
  paramValueInvalidResponse: {
    code: 1004,
    message: 'Parameter value is invalid.',
    data: null,
  },
  statusCode: {
    ok: 200,
    notFound: 404,
    systemError: 505,
  },
  product: {
    media: {
      type: {
        image: 0,
        video: 1,
      },
    },
  },
  tokenField: 'token',
  campaigns_limit: 5,
};

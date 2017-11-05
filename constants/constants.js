module.exports = {
  response: {
    ok: {
      code: 1000,
      message: 'OK',
      data: null,
    },
    spam: {
      code: 9991,
      message: 'Spam',
      data: null,
    },
    productNotExist: {
      code: 9992,
      message: 'Product is not existed.',
      data: null,
    },
    codeVerifyIncorrect: {
      code: 9993,
      message: 'Code verify is incorrect.',
      data: null,
    },
    noDataOrEndListData: {
      code: 9994,
      message: 'No Data or end of list data.',
      data: null,
    },
    userInValid: {
      code: 9995,
      message: 'User is not validated.',
      data: null,
    },
    userExisted: {
      code: 9996,
      message: 'User existed.',
      data: null,
    },
    methodInvalid: {
      code: 9997,
      message: 'Method is invalid.',
      data: null,
    },
    tokenInvalid: {
      code: 9998,
      message: 'Token is invalid.',
      data: null,
    },
    exceptionError: {
      code: 9999,
      message: 'Exception error.',
      data: null,
    },
    cantConnectDB: {
      code: 1001,
      message: 'Can not connect to DB.',
      data: null,
    },
    paramNotEnough: {
      code: 1002,
      message: 'Parameter is not enough.',
      data: null,
    },
    paramTypeInvalid: {
      code: 1003,
      message: 'Parameter type is invalid.',
      data: null,
    },
    paramValueInvalid: {
      code: 1004,
      message: 'Parameter value is invalid.',
      data: null,
    },
    unknownError: {
      code: 1005,
      message: 'Unknown error.',
      data: null,
    },
    fileSizeBig: {
      code: 1006,
      message: 'File size is too big.',
      data: null,
    },
    uploadFileFail: {
      code: 1007,
      message: 'Upload File Failed!.',
      data: null,
    },
    maxNumberImage: {
      code: 1008,
      message: 'Maximum number of images.',
      data: null,
    },
    notAccess: {
      code: 1009,
      message: 'Not access.',
      data: null,
    },
    actionDonePreByUser: {
      code: 1010,
      message: 'action has been done previously by this user.',
      data: null,
    },
    productSolded: {
      code: 1011,
      message: 'The product has been sold.',
      data: null,
    },
    addressNotSupportShipping: {
      code: 1012,
      message: 'Address does not support Shipping.',
      data: null,
    },
    urlUserNotExist: {
      code: 1013,
      message: 'Url User\'s is exist.',
      data: null,
    },
    promoCodeExpired: {
      code: 1014,
      message: 'Promotional code expired.',
      data: null,
    },
    wrongPassword: {
      code: 1015,
      message: 'Password is not valid with user',
      data: null,
    },
    systemError: {
      code: 1016,
      message: 'System have an error',
      data: null,
    },
    userNotFound: {
      code: 1017,
      message: 'Not found user in system',
      data: null,
    },
    campaignNotFound: {
      code: 1018,
      message: 'Not found campaigns in system',
      data: null,
    },
    searchNotFound: {
      code: 1019,
      message: 'Not found items in system',
      data: null,
    },
    conversationNotFound: {
      code: 1020,
      message: 'Not found conversation of user in system',
      data: null,
    },
    noSendPermission: {
      code: 1021,
      message: 'You have not permission to send this message',
      data: null,
    },
    sendError: {
      code: 1022,
      message: 'Have error while send message, please try again',
      data: null,
    },
    sendTokenInvalid: {
      code: 1023,
      message: 'Send token invalid',
      data: null,
    },
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
  dbName: 'moki',
  documents: {
    block: 'blocks',
    brand: 'brands',
    campaign: 'campaigns',
    category: 'categories',
    country: 'countries',
    like: 'likes',
    notification: 'notifications',
    product: 'products',
    report: 'reports',
    searchHistory: 'search_histories',
    size: 'sizes',
    user: 'users',
    userSetting: 'user_settings',
    conversation: 'conversations',
    message: 'messages',
  },
  search: {
    simple: 'simple',
    full: 'full',
  },
  logTransport: {
    console: 1,
    file: 2,
  },
  pushSetting: {
    turnOn: 1,
    turnOff: 0,
  },
  followedField: 'followed',
  followingField: 'following',
  conversation: {
    sender: {
      partner: 1,
      user: 2,
    },
    status: {
      unread: 1,
      read: 0,
    },
    partnerRole: {
      user: 0,
      seller: 1,
      admin: 2,
    },
  },
  socketEvent: {
    connection: 'connection',
    disconnection: 'disconnection',
    message: 'message',
    joinRoomRequest: 'join_room_request',
    joinRoomResponse: 'join_room_response',
    updateMsgStatus: 'update_message_status',
  },
  role: {
    user: 0,
    admin: 1,
  },
  tokenExpired: 1,
};

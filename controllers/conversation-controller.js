const consService = require('../services/conversation-service');

const { constants, helpers } = global;

exports.getConversations = (req, res) => {
  if (!req.body) {
    helpers.sendResponse(res, constants.response.paramNotEnough);
  } else {
    const reqBody = req.body;
    if (!helpers.isExist(reqBody.index) || !helpers.isExist(reqBody.count)) {
      helpers.sendResponse(res, constants.response.paramNotEnough);
    } else {
      const validIndex = helpers.validNumber(reqBody.index);
      const validCount = helpers.validNumber(reqBody.count);
      const userId = req.user.id;

      if (!helpers.isExist(validIndex) ||
        validIndex < 0 ||
        !helpers.isExist(validCount) ||
        validCount < 1) {
        helpers.sendResponse(res, constants.response.paramValueInvalid);
      } else {
        consService.getConversations(userId, validIndex, validCount, (response) => {
          helpers.sendResponse(res, response);
        });
      }
    }
  }
};

exports.getConversationDetail = (req, res) => {
  console.log(req.body);
  if (!req.body || !isEnoughConsParam(req.body)) {
    helpers.sendResponse(res, constants.response.paramNotEnough);
  } else {
    const validParam = validConsParam(req.body, req.user.id);
    if (!validParam) {
      helpers.sendResponse(res, constants.response.paramValueInvalid);
    } else {
      consService.getConversationDetail(validParam, (response) => {
        helpers.sendResponse(res, response);
      });
    }
  }
};

exports.setConversation = (req, res) => {
  if (!req.body || !isEnoughSetConsParam(req.body)) {
    helpers.sendResponse(res, constants.response.paramNotEnough);
  } else {
    const validParam = validSetConsParam(req.body, req.user.id, req.user.role);
    if (!validParam) {
      helpers.sendResponse(res, constants.response.paramValueInvalid);
    } else {
      consService.setConversation(validParam, (response) => {
        helpers.sendResponse(res, response);
      });
    }
  }
};

exports.setReadMessages = (req, res) => {
  const reqData = req.body;
  if (!isEnoughSetReadMsgParam(reqData)) {
    helpers.sendResponse(res, constants.response.paramNotEnough);
  } else if (!isValidSetReadMsgParam(reqData)) {
    helpers.sendResponse(res, constants.response.paramValueInvalid);
  } else {
    const param = {
      userId: req.user.id,
      partnerId: reqData.partnerId,
      productId: reqData.productId,
    };
    consService.setReadMessages(param, (response) => {
      helpers.sendResponse(res, response);
    });
  }
};

function validConsParam(consParam, userId) {
  const {
    partnerId,
    productId,
    index,
    count,
  } = consParam;

  const isValidPartnerId = helpers.isValidId(partnerId);
  const isValidProductId = helpers.isValidId(productId);
  const validIndex = helpers.validNumber(index);
  const validCount = helpers.validNumber(count);

  if (!isValidPartnerId
  || !isValidProductId
  || !helpers.isExist(validIndex)
  || !helpers.isExist(validCount)
  || validIndex < 0
  || validCount < 1) {
    return null;
  }

  return {
    productId,
    userId1: userId,
    userId2: partnerId,
    fromIndex: validIndex,
    limit: validCount,
  };
}


function validSetConsParam(setConsParam, senderId, senderRole) {
  const {
    toId,
    productId,
    message,
  } = setConsParam;

  const isValidToId = helpers.isValidId(toId);
  const isValidProductId = helpers.isValidId(productId);
  const validMessage = helpers.validString(message);

  if (!isValidToId || !isValidProductId || !validMessage) {
    return null;
  }

  return {
    senderId,
    senderRole,
    productId,
    receiverId: toId,
    message: validMessage,
  };
}

function isValidSetReadMsgParam(setReadMsgParam) {
  const {
    partnerId,
    productId,
  } = setReadMsgParam;

  return helpers.isValidId(partnerId) && helpers.isValidId(productId);
}

function isEnoughConsParam(consParam) {
  const {
    partnerId,
    productId,
    index,
    count,
  } = consParam;

  return (helpers.isExist(partnerId)
    && helpers.isExist(productId)
    && helpers.isExist(index)
    && helpers.isExist(count));
}

function isEnoughSetConsParam(setConsParam) {
  const {
    toId,
    productId,
    message,
  } = setConsParam;

  return (helpers.isExist(toId)
    && helpers.isExist(productId)
    && helpers.isExist(message));
}

function isEnoughSetReadMsgParam(setReadMsgParam) {
  if (!setReadMsgParam) {
    return false;
  }

  const {
    partnerId,
    productId,
  } = setReadMsgParam;

  return (helpers.isExist(partnerId) && helpers.isExist(productId));
}

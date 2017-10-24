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
  if (!req.body || !isEnoughtConsParam(req.body)) {
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

function validConsParam(consParam, userId) {
  const {
    partnerId,
    productId,
    conversationId,
    index,
    count,
  } = consParam;

  const isValidPartnerId = helpers.isValidId(partnerId);
  const isValidProductId = helpers.isValidId(productId);
  const isValidConsId = helpers.isValidId(conversationId);
  const validIndex = helpers.validNumber(index);
  const validCount = helpers.validNumber(count);

  if (!isValidPartnerId
  || !isValidProductId
  || !isValidConsId
  || !helpers.isExist(validIndex)
  || !helpers.isExist(validCount)
  || validIndex < 0
  || validCount < 1) {
    return null;
  }

  return {
    productId,
    conversationId,
    userId1: userId,
    userId2: partnerId,
    fromIndex: validIndex,
    limit: validCount,
  };
}

function isEnoughtConsParam(consParam) {
  const {
    partnerId,
    productId,
    conversationId,
    index,
    count,
  } = consParam;

  if (!helpers.isExist(partnerId)
    || !helpers.isExist(productId)
    || !helpers.isExist(conversationId)
    || !helpers.isExist(index)
    || !helpers.isExist(count)) {
    return false;
  }
  return true;
}

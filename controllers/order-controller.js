const orderService = require('../services/order-service');

const { helpers, constants } = global;

exports.getOrderAddressList = (req, res) => {
  orderService.getOrderAddressList(req.user.id, (responseData) => {
    helpers.sendResponse(res, responseData);
  });
};

exports.deleteOrderAddress = (req, res) => {
  const data = req.body;
  if (!data) {
    helpers.sendResponse(res, constants.response.paramValueInvalid);
  } else {
    const orderAddressId = data.id;

    if (!helpers.isExist(orderAddressId)) {
      helpers.sendResponse(res, constants.response.paramNotEnough);
    } else if (!helpers.isValidId(orderAddressId)) {
      helpers.sendResponse(res, constants.response.paramValueInvalid);
    } else {
      orderService.deleteOrderAddress(orderAddressId, req.user.id, (responseData) => {
        helpers.sendResponse(res, responseData);
      });
    }
  }
};


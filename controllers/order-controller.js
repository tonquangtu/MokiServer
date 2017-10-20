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

exports.addOrderAddress = (req, res) => {
  const data = req.body;
  if (!data) {
    helpers.sendResponse(res, constants.response.paramValueInvalid);
  } else {
    const { address, addressId } = data;
    const isDefaultAddress = data.default;

    if (!helpers.isExist(address)
      || !helpers.isExist(addressId)
      || !helpers.isExist(isDefaultAddress)) {
      helpers.sendResponse(res, constants.response.paramNotEnough);
    } else if ((typeof address !== 'string' && !(address instanceof String))
      || !Array.isArray(addressId)) {
      helpers.sendResponse(res, constants.response.paramTypeInvalid);
    } else {
      const addressValid = helpers.validString(address);
      const defaultValid = helpers.validInteger(isDefaultAddress);

      if (addressValid === null
        || defaultValid === null
        || (defaultValid !== 0 && defaultValid !== 1)
        || addressId.length !== 3
        || !isIntegerArray(addressId)) {
        helpers.sendResponse(res, constants.response.paramValueInvalid);
      } else {
        orderService.addOrderAddress(
          addressValid, addressId, defaultValid, req.user.id,
          (responseData) => {
            helpers.sendResponse(res, responseData);
          }
        );
      }
    }
  }
};

function isIntegerArray(arr) {
  return arr.every((item) => {
    const itemValid = helpers.validInteger(item);
    return itemValid !== null;
  });
}
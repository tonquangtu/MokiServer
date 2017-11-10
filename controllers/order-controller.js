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
    } else if (!isValidTypeParams(address, addressId)) {
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

exports.editOrderAddress = (req, res) => {
  const data = req.body;

  if (!data) {
    helpers.sendResponse(res, constants.response.paramValueInvalid);
  } else {
    const { address, addressId } = data;
    const isDefaultAddress = data.default;
    const orderAddressId = data.id;

    if (!helpers.isExist(orderAddressId)) {
      helpers.sendResponse(res, constants.response.paramNotEnough);
    } else if (!isValidTypeParams(address, addressId)) {
      helpers.sendResponse(res, constants.response.paramTypeInvalid);
    } else if (!isValidValueParams(address, isDefaultAddress, addressId, orderAddressId)) {
      helpers.sendResponse(res, constants.response.paramValueInvalid);
    } else {
      const addressValid = helpers.isExist(address) ? helpers.validString(address) : null;
      const defaultValid = helpers.isExist(isDefaultAddress) ?
        helpers.validInteger(isDefaultAddress) : null;
      const addressIdValid = helpers.isExist(addressId) ? addressId : null;

      orderService.editOrderAddress(
        addressValid, addressIdValid, defaultValid, orderAddressId, req.user.id,
        (responseData) => {
          helpers.sendResponse(res, responseData);
        }
      );
    }
  }
};

function isIntegerArray(arr) {
  return arr.every((item) => {
    const itemValid = helpers.validInteger(item);
    return itemValid !== null;
  });
}

function isValidTypeParams(address, addressId) {
  return !((helpers.isExist(address) && typeof address !== 'string' && !(address instanceof String))
  || (helpers.isExist(addressId) && !Array.isArray(addressId)));
}

function isValidValueParams(address, isDefaultAddress, addressId, orderAddressId) {
  if (helpers.isExist(address)) {
    const addressValid = helpers.validString(address);
    if (addressValid === null) {
      return false;
    }
  }

  if (helpers.isExist(isDefaultAddress)) {
    const defaultValid = helpers.validInteger(isDefaultAddress);
    if ((defaultValid === null) || (defaultValid !== 0 && defaultValid !== 1)) {
      return false;
    }
  }

  if (helpers.isExist(addressId)) {
    if (addressId.length !== 3 || !isIntegerArray(addressId)) {
      return false;
    }
  }

  if (!helpers.isValidId(orderAddressId)) {
    return false;
  }

  return true;
}

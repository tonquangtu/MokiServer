const orderRepo = require('../repositories/order-repository');

const { logger, constants, _ } = global;

exports.getOrderAddressList = (userId, callback) => {
  const promiseOrder = orderRepo.getOrderAddressList(userId);
  promiseOrder.then((order) => {
    if (!order) {
      return callback(constants.response.noDataOrEndListData);
    }
    const responseData = getResponseData(order);

    return callback(responseData);
  }).catch((err) => {
    logger.error('Error at function getOrderAddressList.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.deleteOrderAddress = (orderAddressId, userId, callback) => {
  const promiseOrder = orderRepo.getOrderAddressList(userId);
  promiseOrder.then((order) => {
    if (!order) {
      return callback(constants.response.noDataOrEndListData);
    }
    const orderAddresses = order.order_addresses;

    _.remove(orderAddresses, { id: orderAddressId });

    const userOrderAddressData = {
      user: userId,
      order_addresses: orderAddresses,
    };

    return orderRepo.findAndUpdateOrderAddress(userId, userOrderAddressData, { new: true });
  }).then((newOrder) => {
    if (newOrder) {
      const responseData = getResponseData(newOrder);

      return callback(responseData);
    }
  }).catch((err) => {
    logger.error('Error at function deleteOrderAddress.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.addOrderAddress = (address, addressId, isDefault, userId, callback) => {
  const orderPromise = orderRepo.getOrderAddressList(userId);
  orderPromise.then((order) => {
    if (!order) {
      const userOrderAddressData = {
        user: userId,
        order_addresses: [{
          address,
          addresses_id: addressId,
          default: isDefault,
        }],
      };
      return orderRepo.addUserOrderAddress(userOrderAddressData);
    }

    const orderAddresses = order.order_addresses;

    orderAddresses.push({
      address,
      addresses_id: addressId,
      default: isDefault,
    });

    const userOrderAddressData = {
      user: userId,
      order_addresses: orderAddresses,
    };

    return orderRepo.findAndUpdateOrderAddress(userId, userOrderAddressData, { new: true });
  }).then((newOrder) => {
    const responseData = getResponseData(newOrder);

    return callback(responseData);
  }).catch((err) => {
    logger.error('Error at function addOrderAddress.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.editOrderAddress = (address, addressId, isDefault, orderAddressId, userId, callback) => {
  const orderPromise = orderRepo.getOrderAddressList(userId);
  orderPromise.then((order) => {
    if (!order) {
      return callback(constants.response.noDataOrEndListData);
    }

    const orderAddresses = order.order_addresses;

    const index = _.findIndex(orderAddresses, { id: orderAddressId });

    if (index === -1) {
      return callback(constants.response.noDataOrEndListData);
    }

    const orderAddress = orderAddresses[index];

    const newAddress = (address === null) ? orderAddress.address : address;
    const newAddressesId = (addressId === null) ? orderAddress.addresses_id : addressId;
    const newDefault = (isDefault === null) ? orderAddress.default : isDefault;

    orderAddresses.splice(index, 1, {
      address: newAddress,
      addresses_id: newAddressesId,
      default: newDefault,
    });

    const userOrderAddressData = {
      user: userId,
      order_addresses: orderAddresses,
    };

    return orderRepo.findAndUpdateOrderAddress(userId, userOrderAddressData, { new: true });
  }).then((newOrder) => {
    if (newOrder) {
      const responseData = getResponseData(newOrder);

      return callback(responseData);
    }
  }).catch((err) => {
    logger.error('Error at function editOrderAddress.\n', err);
    return callback(constants.response.systemError);
  });
};

function getResponseData(order) {
  const orderAddresses = order.order_addresses.map((orderAddress) => {
    return {
      id: orderAddress.id,
      address: orderAddress.address,
      addressId: orderAddress.addresses_id,
      default: orderAddress.default,
    };
  });

  return {
    code: constants.response.ok.code,
    message: constants.response.ok.message,
    data: orderAddresses,
  };
}

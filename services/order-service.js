const orderRepo = require('../repositories/order-repository');

const { logger, constants, _ } = global;

exports.getOrderAddressList = (userId, callback) => {
  const promiseOrder = orderRepo.getOrderAddressList(userId);
  promiseOrder.then((order) => {
    if (!order) {
      return callback(constants.response.noDataOrEndListData);
    }
    const orderAddresses = order.order_addresses.map((orderAddress) => {
      return {
        id: orderAddress.id,
        address: orderAddress.address,
        addressId: orderAddress.addresses_id,
        default: orderAddress.default,
      };
    });

    const responseData = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data: orderAddresses,
    };

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
    const orderAddresses = newOrder.order_addresses.map((orderAddress) => {
      return {
        id: orderAddress.id,
        address: orderAddress.address,
        addressId: orderAddress.addresses_id,
        default: orderAddress.default,
      };
    });

    const responseData = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data: orderAddresses,
    };

    return callback(responseData);
  }).catch((err) => {
    logger.error('Error at function deleteOrderAddress.\n', err);
    return callback(constants.response.systemError);
  });
};


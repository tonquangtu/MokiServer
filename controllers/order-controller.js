const orderService = require('../services/order-service');

const { helpers } = global;

exports.getOrderAddressList = (req, res) => {
  orderService.getOrderAddressList(req.user.id, (responseData) => {
    helpers.sendResponse(res, responseData);
  });
};

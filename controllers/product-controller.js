const { constants, helpers } = global;

const productService = require('../services/product-service');

exports.getProductList = (req, res) => {
  let statusCode = 200;
  let response = {};
  const data = req.body;
  if (!req.user) {
    response = {
      code: constants.response.userNotFound.code,
      message: constants.response.userNotFound.message,
      data: null,
    };
    statusCode = 404;
    helpers.sendResponse(res, statusCode, response);
  } else {
    productService.getProductList(
      data.category_id ? data.category_id : 0,
      data.campaign_id ? data.campaign_id : 0,
      data.last_id ? data.last_id : 0,
      data.count,
      data.index,
      req.user.id,
      (responseData) => {
        helpers.sendResponse(res, statusCode, responseData);
      },
    );
  }
};

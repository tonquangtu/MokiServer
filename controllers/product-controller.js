const { helpers } = global;

const productService = require('../services/product-service');

exports.getProductList = (req, res) => {
  const statusCode = 200;
  const data = req.body;
  const categoryId = data.category_id ? data.category_id : 0;
  const campaignId = data.campaign_id ? data.campaign_id : 0;
  const lastId = data.last_id ? data.last_id : 0;
  const userId = req.user ? req.user.id : 0;
  productService.getProductList({
    categoryId,
    campaignId,
    lastId,
    count: data.count,
    index: data.index,
    userId,
  }, (responseData) => {
    helpers.sendResponse(res, statusCode, responseData);
  });
};
exports.getProductDetail = (req, res) => {
  const statusCode = 200;
  const data = req.body;
  const productId = data.id;
  const userId = req.user ? req.user.userId : 0;
  productService.getProductDetail(productId, userId, (responseData) => {
    helpers.sendResponse(res, statusCode, responseData);
  });
};

exports.likeProduct = (req, res) => {
  const data = req.body;
  const validateResult = validateProductId(data.productId);
  if (!validateResult.valid) {
    helpers.sendResponse(res, validateResult.statusCode, validateResult.responseData);
  } else {
    const { productId } = validateResult.responseData;
    productService.likeProduct(productId, req.user.id, (responseData) => {
      helpers.sendResponse(res, validateResult.statusCode, responseData);
    });
  }
};

function validateProductId(productId) {

}
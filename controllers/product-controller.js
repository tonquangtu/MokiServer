const { helpers, constants } = global;

const productService = require('../services/product-service');

exports.getProductList = (req, res) => {
  const data = req.body;
  const validValue = validateValueProductListParams(data);

  if (!data.count || !data.index) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramNotEnough);
  } else if (!Number.isInteger(data.count)) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramTypeInvalid);
  } else if (!validValue) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramValueInvalid);
  } else {
    const {
      categoryId, campaignId, lastId,
    } = validValue;
    const userId = req.user ? req.user.userId : 0;

    productService.getProductList({
      categoryId,
      campaignId,
      lastId,
      count: data.count,
      index: data.index,
      userId,
    }, (responseData) => {
      helpers.sendResponse(res, constants.statusCode.ok, responseData);
    });
  }
};

exports.getProductDetail = (req, res) => {
  const data = req.body;

  if (!data.id) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramNotEnough);
  } else if (!helpers.isValidId(data.id)) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramValueInvalid);
  } else {
    const userId = req.user ? req.user.userId : 0;

    productService.getProductDetail(data.id, userId, (responseData) => {
      helpers.sendResponse(res, constants.statusCode.ok, responseData);
    });
  }
};

exports.getCommentProduct = (req, res) => {
  const data = req.body;

  if (!data.productId) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramNotEnough);
  } else if (!helpers.isValidId(data.productId)) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramValueInvalid);
  } else {
    productService.getCommentProduct(data.productId, (responseData) => {
      helpers.sendResponse(res, constants.statusCode.ok, responseData);
    });
  }
};

exports.postCommentProduct = (req, res) => {
  const data = req.body;
  const validValue = validateValueComment(data);

  if (!data.productId || !data.comment || !data.index) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramNotEnough);
  } else if (typeof data.comment !== 'string' && !(data.comment instanceof String)) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramTypeInvalid);
  } else if (!validValue) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramValueInvalid);
  } else {
    const {
      productId, comment, index,
    } = validValue;

    productService.addCommentProduct(productId, comment, index, req.user.id, (responseData) => {
      helpers.sendResponse(res, constants.statusCode.ok, responseData);
    });
  }
};

exports.deleteProduct = (req, res) => {
  const data = req.body;

  if (!data.id) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramNotEnough);
  } else if (!helpers.isValidId(data.id)) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramValueInvalid);
  } else {
    productService.deleteProduct(data.id, req.user.id, (responseData) => {
      helpers.sendResponse(res, constants.statusCode.ok, responseData);
    });
  }
};

exports.likeProduct = (req, res) => {
  const data = req.body;

  if (!data.productId) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramNotEnough);
  } else if (!helpers.isValidId(data.productId)) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramValueInvalid);
  } else {
    productService.likeProduct(data.productId, req.user.id, (responseData) => {
      helpers.sendResponse(res, constants.statusCode.ok, responseData);
    });
  }
};

function validateValueProductListParams(productListParams) {
  const categoryId = productListParams.categoryId ? productListParams.categoryId : 0;
  const campaignId = productListParams.campaignId ? productListParams.campaignId : 0;
  const lastId = productListParams.lastId ? productListParams.lastId : 0;

  if ((categoryId !== 0 && !helpers.isValidId(categoryId))
    || (campaignId !== 0 && !helpers.isValidId(campaignId))
    || (lastId !== 0 && !helpers.isValidId(lastId))
    || !helpers.isValidId(productListParams.index)) {
    return false;
  }

  return {
    categoryId, campaignId, lastId,
  };
}

function validateValueComment(commentParams) {
  const { productId, comment, index } = commentParams;
  if (!helpers.isValidId(productId) || !helpers.isValidId(index) || comment.trim() === '') {
    return false;
  }

  return {
    productId, comment, index,
  };
}

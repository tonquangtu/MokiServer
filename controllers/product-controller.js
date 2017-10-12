const { helpers, constants } = global;

const productService = require('../services/product-service');

exports.getProductList = (req, res) => {
  const data = req.body;
  const validateResult = validateProductListParams(data);
  if (!validateResult.valid) {
    helpers.sendResponse(res, validateResult.statusCode, validateResult.responseData);
  } else {
    const {
      categoryId, campaignId, lastId, count, index,
    } = validateResult.responseData;
    const userId = req.user ? req.user.userId : 0;
    productService.getProductList({
      categoryId,
      campaignId,
      lastId,
      count,
      index,
      userId,
    }, (responseData) => {
      helpers.sendResponse(res, validateResult.statusCode, responseData);
    });
  }
};

exports.getProductDetail = (req, res) => {
  const data = req.body;
  const validateResult = validateProductId(data.id);
  if (!validateResult.valid) {
    helpers.sendResponse(res, validateResult.statusCode, validateResult.responseData);
  } else {
    const { productId } = validateResult.responseData;
    const userId = req.user ? req.user.userId : 0;
    productService.getProductDetail(productId, userId, (responseData) => {
      helpers.sendResponse(res, validateResult.statusCode, responseData);
    });
  }
};

exports.getCommentProduct = (req, res) => {
  const data = req.body;
  const validateResult = validateProductId(data.productId);
  if (!validateResult.valid) {
    helpers.sendResponse(res, validateResult.statusCode, validateResult.responseData);
  } else {
    const { productId } = validateResult.responseData;
    productService.getCommentProduct(productId, (responseData) => {
      helpers.sendResponse(res, validateResult.statusCode, responseData);
    });
  }
};

function validateProductListParams(productListParams) {
  const categoryId = productListParams.categoryId ? productListParams.categoryId : 0;
  const campaignId = productListParams.campaignId ? productListParams.campaignId : 0;
  const lastId = productListParams.lastId ? productListParams.lastId : 0;

  if ((categoryId !== 0 && !helpers.isValidId(categoryId))
  || (campaignId !== 0 && !helpers.isValidId(campaignId))
  || (lastId !== 0 && !helpers.isValidId(lastId))
  || !helpers.isValidId(productListParams.index)) {
    return {
      valid: false,
      statusCode: constants.statusCode.notFound,
      responseData: constants.response.paramValueInvalid,
    };
  }

  if (!productListParams.count || !productListParams.index) {
    return {
      valid: false,
      statusCode: constants.statusCode.notFound,
      responseData: constants.response.paramNotEnough,
    };
  }

  if (!Number.isInteger(productListParams.count)) {
    return {
      valid: false,
      statusCode: constants.statusCode.notFound,
      responseData: constants.response.paramTypeInvalid,
    };
  }
  const { count, index } = productListParams;
  return {
    valid: true,
    statusCode: constants.statusCode.ok,
    responseData: {
      categoryId, campaignId, lastId, count, index,
    },
  };
}

function validateProductId(productId) {
  if (!productId) {
    return {
      valid: false,
      statusCode: constants.statusCode.notFound,
      responseData: constants.response.paramNotEnough,
    };
  }
  if (!helpers.isValidId(productId)) {
    return {
      valid: false,
      statusCode: constants.statusCode.notFound,
      responseData: constants.response.paramValueInvalid,
    };
  }

  return {
    valid: true,
    statusCode: constants.statusCode.ok,
    responseData: {
      productId,
    },
  };
}

const { helpers, constants } = global;

const productService = require('../services/product-service');

exports.getProductList = (req, res) => {
  const data = req.body;

  if (!data.count || !data.index) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramNotEnough);
  } else if (!Number.isInteger(data.count)) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramTypeInvalid);
  } else if (!validateValueProductListParams(data)) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramValueInvalid);
  } else {
    const {
      categoryId, campaignId, lastId,
    } = validateValueProductListParams(data);

    productService.getProductList({
      categoryId,
      campaignId,
      lastId,
      count: data.count,
      index: data.index,
      userId: helpers.getUserIdFromToken(data.token),
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

    productService.getProductDetail(data.id, helpers.getUserIdFromToken(data.token), (responseData) => {
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
    productService.getCommentProduct(data.productId, helpers.getUserIdFromToken(data.token), (responseData) => {
      helpers.sendResponse(res, constants.statusCode.ok, responseData);
    });
  }
};

exports.postCommentProduct = (req, res) => {
  const data = req.body;

  if (!data.productId || !data.comment || !data.index) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramNotEnough);
  } else if (typeof data.comment !== 'string' && !(data.comment instanceof String)) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramTypeInvalid);
  } else if (!validateValueCommentParams(data)) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramValueInvalid);
  } else {
    const {
      productId, comment, index,
    } = validateValueCommentParams(data);

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

exports.reportProduct = (req, res) => {
  const data = req.body;

  if (!data.productId || !data.subject || !data.details) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramNotEnough);
  } else if ((typeof data.subject !== 'string' && !(data.subject instanceof String))
  || (typeof data.details !== 'string' && !(data.details instanceof String))) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramTypeInvalid);
  } else if (!validateValueReportParams(data)) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramValueInvalid);
  } else {
    const { productId, subject, details } = validateValueReportParams(data);

    productService.reportProduct(productId, subject, details, req.user.id, (responseData) => {
      helpers.sendResponse(res, constants.statusCode.ok, responseData);
    });
  }
};

exports.getProductListMyLike = (req, res) => {
  const data = req.body;

  if (!data.count || !data.index) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramNotEnough);
  } else if (!Number.isInteger(data.count)) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramTypeInvalid);
  } else if (!helpers.isValidId(data.index)) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramValueInvalid);
  } else {
    productService.getProductListMyLike(data.index, data.count, req.user.id, (responseData) => {
      helpers.sendResponse(res, constants.statusCode.ok, responseData);
    });
  }
};

exports.getNumberNewItems = (req, res) => {
  const data = req.body;
  if (!data.lastId) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramNotEnough);
  } else if (!validateValueCheckNewItemParams(data)) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramValueInvalid);
  } else {
    const { lastId, categoryId } = validateValueCheckNewItemParams(data);

    productService.getNumberNewItems(lastId, categoryId, (responseData) => {
      helpers.sendResponse(res, constants.statusCode.ok, responseData);
    });
  }
};

exports.addProduct = (req, res) => {
  const data = req.body;
  const attributeRequiredArr = [
    data.price,
    data.name,
    data.categoryId,
    data.shipsFrom,
    data.shipsFromId,
    data.condition,
  ];
  const attributeIntegerArr = [
    data.price,
    data.condition,
  ];
  const attributeStringArr = [
    data.name,
    data.shipsFrom,
  ];
  if (!checkExist(attributeRequiredArr)) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramNotEnough);
  } else if (!checkInteger(attributeIntegerArr) || !checkString(attributeStringArr)) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramTypeInvalid);
  } else if (!checkValueAddProductParams(data)) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramValueInvalid);
  } else {
    productService.addProduct(data, req.user.id, (responseData) => {
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

function validateValueCommentParams(commentParams) {
  const { productId, comment, index } = commentParams;
  if (!helpers.isValidId(productId) || !helpers.isValidId(index) || comment.trim() === '') {
    return false;
  }

  return {
    productId, comment, index,
  };
}

function validateValueReportParams(reportParams) {
  const { productId, subject, details } = reportParams;

  if (!helpers.isValidId(productId) || subject.trim() === '' || details.trim() === '') {
    return false;
  }

  return {
    productId, subject, details,
  };
}

function validateValueCheckNewItemParams(checkNewItemParams) {
  const categoryId = checkNewItemParams.categoryId ? checkNewItemParams.categoryId : 0;
  const { lastId } = checkNewItemParams;

  if ((categoryId !== 0 && !helpers.isValidId(categoryId)) || !helpers.isValidId(lastId)) {
    return false;
  }

  return { categoryId, lastId };
}

function checkExist(attributeArray) {
  return attributeArray.indexOf(undefined) === -1;
}

function checkInteger(attributeArray) {
  return attributeArray.map((item) => {
    return Number.isInteger(item);
  }).indexOf(false) === -1;
}

function checkString(attributeArray) {
  return attributeArray.map((item) => {
    return helpers.validString(item);
  }).indexOf(null) === -1;
}

function checkValueAddProductParams(data) {
  if (!helpers.isValidId(data.categoryId)
    || (checkExist([data.brandId]) && !helpers.isValidId(data.brandId))
    || (checkExist([data.productSizeId]) && !helpers.isValidId(data.productSizeId))
    || data.name.length > 30) {
    return false;
  }

  return true;
}

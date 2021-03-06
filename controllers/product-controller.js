const { helpers, constants } = global;

const productService = require('../services/product-service');

exports.getProductList = (req, res) => {
  const data = req.body;

  if (!data || !helpers.isExist(data.count) || !helpers.isExist(data.index)) {
    helpers.sendResponse(res, constants.response.paramNotEnough);
  } else {
    const count = helpers.validInteger(data.count);
    const validValueParams = validValueProductsParams(data);

    if (count === null) {
      helpers.sendResponse(res, constants.response.paramTypeInvalid);
    } else if (!validValueParams) {
      helpers.sendResponse(res, constants.response.paramValueInvalid);
    } else {
      const {
        categoryIdValid, campaignIdValid, lastIdValid, index,
      } = validValueParams;
      const user = helpers.getUserFromToken(data.token);
      const userId = user ? user.id : 0;

      productService.getProductList({
        categoryId: categoryIdValid,
        campaignId: campaignIdValid,
        lastId: lastIdValid,
        count,
        index,
        userId,
      }, (responseData) => {
        helpers.sendResponse(res, responseData);
      });
    }
  }
};

exports.getProductDetail = (req, res) => {
  const data = req.body;

  if (!data || !helpers.isExist(data.id)) {
    helpers.sendResponse(res, constants.response.paramNotEnough);
  } else {
    const { id, token } = data;
    if (!helpers.isValidId(id)) {
      helpers.sendResponse(res, constants.response.paramValueInvalid);
    } else {
      const user = helpers.getUserFromToken(token);
      const userId = user ? user.id : 0;
      productService.getProductDetail(id, userId, (responseData) => {
        helpers.sendResponse(res, responseData);
      });
    }
  }
};

exports.getCommentProduct = (req, res) => {
  const data = req.body;

  if (!data || !helpers.isExist(data.productId)) {
    helpers.sendResponse(res, constants.response.paramNotEnough);
  } else {
    const { productId, token } = data;
    if (!helpers.isValidId(productId)) {
      helpers.sendResponse(res, constants.response.paramValueInvalid);
    } else {
      const user = helpers.getUserFromToken(token);
      const userId = user ? user.id : 0;
      productService.getProductCommentList(productId, userId, (responseData) => {
        helpers.sendResponse(res, responseData);
      });
    }
  }
};

exports.postCommentProduct = (req, res) => {
  const data = req.body;

  if (!data
    || !helpers.isExist(data.productId)
    || !helpers.isExist(data.comment)
    || !helpers.isExist(data.index)) {
    helpers.sendResponse(res, constants.response.paramNotEnough);
    
  } else {
    const { productId, comment } = data;
    const validValueParams = validValueCommentParams(data);

    if (typeof comment !== 'string' && !(comment instanceof String)) {
      helpers.sendResponse(res, constants.response.paramTypeInvalid);
    } else if (!validValueParams) {
      helpers.sendResponse(res, constants.response.paramValueInvalid);
    } else {
      productService.addProductComment(
        productId, validValueParams.commentValid, validValueParams.index, req.user.id,
        (responseData) => {
          helpers.sendResponse(res, responseData);
        }
      );
    }
  }
};

exports.deleteProduct = (req, res) => {
  const data = req.body;

  if (!data || !helpers.isExist(data.id)) {
    helpers.sendResponse(res, constants.response.paramNotEnough);
  } else {
    const productId = data.id;

    if (!helpers.isValidId(productId)) {
      helpers.sendResponse(res, constants.response.paramValueInvalid);
    } else {
      productService.deleteProduct(productId, req.user.id, (responseData) => {
        helpers.sendResponse(res, responseData);
      });
    }
  }
};

exports.likeProduct = (req, res) => {
  const data = req.body;

  if (!data || !helpers.isExist(data.productId)) {
    helpers.sendResponse(res, constants.response.paramNotEnough);
  } else {
    const { productId } = data;

    if (!helpers.isValidId(productId)) {
      helpers.sendResponse(res, constants.response.paramValueInvalid);
    } else {
      productService.likeProduct(productId, req.user.id, (responseData) => {
        helpers.sendResponse(res, responseData);
      });
    }
  }
};

exports.reportProduct = (req, res) => {
  const data = req.body;

  if (!data
    || !helpers.isExist(data.productId)
    || !helpers.isExist(data.subject)
    || !helpers.isExist(data.details)) {
    helpers.sendResponse(res, constants.response.paramNotEnough);
  } else {
    const { productId, subject, details } = data;
    const validValueParams = validValueReportParams(data);

    if ((typeof subject !== 'string' && !(subject instanceof String))
      || (typeof details !== 'string' && !(details instanceof String))) {
      helpers.sendResponse(res, constants.response.paramTypeInvalid);
    } else if (!validValueParams) {
      helpers.sendResponse(res, constants.response.paramValueInvalid);
    } else {
      const { subjectValid, detailsValid } = validValueParams;

      productService.reportProduct(
        productId, subjectValid, detailsValid, req.user.id,
        (responseData) => {
          helpers.sendResponse(res, responseData);
        }
      );
    }
  }
};

exports.getProductListMyLike = (req, res) => {
  const data = req.body;

  if (!data || !helpers.isExist(data.count) || !helpers.isExist(data.index)) {
    helpers.sendResponse(res, constants.response.paramNotEnough);
  } else {
    const { count, index } = data;
    const countValid = helpers.validInteger(count);
    const indexValid = helpers.validInteger(index);

    if (countValid === null || indexValid === null) {
      helpers.sendResponse(res, constants.response.paramTypeInvalid);
    } else if (indexValid < 0 || countValid <= 0) {
      helpers.sendResponse(res, constants.response.paramValueInvalid);
    } else {
      productService.getMyLikeProductList(index, countValid, req.user.id, (responseData) => {
        helpers.sendResponse(res, responseData);
      });
    }
  }
};

exports.getNewItemNumber = (req, res) => {
  const data = req.body;

  if (!data) {
    helpers.sendResponse(res, constants.response.paramValueInvalid);
  } else {
    const { lastId } = data;

    const validValueParams = validValueCheckNewItemParams(data);
    if (!helpers.isExist(lastId)) {
      helpers.sendResponse(res, constants.response.paramNotEnough);
    } else if (!validValueParams) {
      helpers.sendResponse(res, constants.response.paramValueInvalid);
    } else {
      const { categoryIdValid } = validValueParams;

      productService.getNewItemNumber(lastId, categoryIdValid, (responseData) => {
        helpers.sendResponse(res, responseData);
      });
    }
  }
};

exports.addProduct = (req, res) => {
  const data = req.body;
  if (!data || !helpers.isExist(data.price) || !helpers.isExist(data.name)
    || !helpers.isExist(data.categoryId) || !helpers.isExist(data.shipsFrom)
    || !helpers.isExist(data.shipsFromId) || !helpers.isExist(data.condition)
    || (!helpers.isExist(data.image) && !helpers.isExist(data.video))) {
    helpers.sendResponse(res, constants.response.paramNotEnough);
  } else {
    const {
      price, name, categoryId, shipsFrom, shipsFromId, image, video, thumb,
      condition, brandId, productSizeId, described, weight, dimension,
    } = data;

    const priceValid = helpers.validInteger(price);
    const conditionValid = helpers.validInteger(condition);
    const nameValid = helpers.validString(name);
    const shipsFromValid = helpers.validString(shipsFrom);

    if (priceValid === null || conditionValid === null
      || nameValid === null || shipsFromValid === null) {
      helpers.sendResponse(res, constants.response.paramTypeInvalid);
    } else if (!helpers.isValidId(categoryId)
      || (helpers.isExist(brandId) && !helpers.isValidId(brandId))
      || (helpers.isExist(productSizeId) && !helpers.isValidId(productSizeId))
      || name.length > 30) {
      helpers.sendResponse(res, constants.response.paramValueInvalid);
    } else {
      const dataValid = {
        price: priceValid,
        name: nameValid,
        categoryId,
        shipsFrom: shipsFromValid,
        shipsFromId,
        condition: conditionValid,
        brandId,
        productSizeId,
        described,
        weight,
        dimension,
        image,
        video,
        thumb,
      };
      productService.addProduct(dataValid, req.user.id, (responseData) => {
        helpers.sendResponse(res, responseData);
      });
    }
  }
};

exports.getUserListing = (req, res) => {
  const data = req.body;

  if (!data
    || !helpers.isExist(data.index)
    || !helpers.isExist(data.count)
    || (!helpers.isExist(data.token) && !helpers.isExist(data.userId))) {
    helpers.sendResponse(res, constants.response.paramNotEnough);
  } else {
    const {
      token, index, count, userId, keyword, categoryId,
    } = data;

    let myId = 0;
    const indexValid = helpers.validInteger(index);
    const countValid = helpers.validInteger(count);

    if (helpers.isExist(token)) {
      const user = helpers.getUserFromToken(token);
      myId = user ? user.id : 0;
    }

    if (indexValid === null || countValid === null) {
      helpers.sendResponse(res, constants.response.paramTypeInvalid);
    } else if (indexValid < 0
      || countValid < 0
      || (helpers.isExist(userId) && !helpers.isValidId(userId))
      || (helpers.isExist(categoryId) && !helpers.isValidId(categoryId))) {
      helpers.sendResponse(res, constants.response.paramValueInvalid);
    } else {
      const userIdValid = helpers.isExist(userId) ? userId : 0;
      const categoryIdValid = helpers.isExist(categoryId) ? categoryId : 0;
      const keywordValid = helpers.isExist(keyword) ? keyword : 0;

      const userListingParams = {
        myId,
        indexValid,
        countValid,
        userIdValid,
        keywordValid,
        categoryIdValid,
      };

      productService.getUserListing(userListingParams, (responseData) => {
        helpers.sendResponse(res, responseData);
      });
    }
  }
};

exports.editProduct = (req, res) => {
  const data = req.body;

  if (!data
    || !helpers.isExist(data.id)
    || !helpers.isExist(data.name)
    || !helpers.isExist(data.price)
    || !helpers.isExist(data.productSizeId)
    || !helpers.isExist(data.brandId)
    || !helpers.isExist(data.categoryId)
    || !helpers.isExist(data.shipsFromId)) {
    helpers.sendResponse(res, constants.response.paramNotEnough);
  } else {
    const validParams = validEditProductParams(data);

    const {
      nameValid,
      priceValid,
      describedValid,
      shipsFromValid,
      conditionValid,
      weightValid,
    } = validParams;
    const {
      id,
      productSizeId,
      brandId,
      categoryId,
      shipsFromId,
      dimension,
      image,
      imageDel,
      video,
      thumb,
    } = data;
    if (nameValid === null
      || priceValid === null
      || describedValid === null
      || shipsFromValid === null
      || conditionValid === null
      || weightValid === null) {
      helpers.sendResponse(res, constants.response.paramTypeInvalid);
    } else if (priceValid < 0
      || !helpers.isValidId(productSizeId)
      || !helpers.isValidId(brandId)
      || !helpers.isValidId(categoryId)
      || shipsFromId.length !== 3) {
      helpers.sendResponse(res, constants.response.paramValueInvalid);
    } else {
      const dataValid = {
        productId: id,
        price: priceValid,
        name: nameValid,
        categoryId,
        shipsFrom: shipsFromValid,
        shipsFromId,
        condition: conditionValid,
        brandId,
        productSizeId,
        described: describedValid,
        weight: weightValid,
        dimension,
        image,
        imageDel,
        video,
        thumb,
      };
      productService.editProduct(dataValid, req.user.id, (responseData) => {
        helpers.sendResponse(res, responseData);
      });
    }
  }
};

function validValueProductsParams(productListParams) {
  const categoryId = productListParams.categoryId ? productListParams.categoryId : 0;
  const campaignId = productListParams.campaignId ? productListParams.campaignId : 0;
  const lastId = productListParams.lastId ? productListParams.lastId : 0;
  const { index, count } = productListParams;

  if ((categoryId !== 0 && !helpers.isValidId(categoryId))
    || (campaignId !== 0 && !helpers.isValidId(campaignId))
    || (lastId !== 0 && !helpers.isValidId(lastId))
    || (index !== '0' && !helpers.isValidId(index))
    || count <= 0) {
    return false;
  }

  return {
    categoryIdValid: categoryId,
    campaignIdValid: campaignId,
    lastIdValid: lastId,
    index,
  };
}

function validValueCommentParams(commentParams) {
  const { productId } = commentParams;
  const index = commentParams.index === '' ? 0 : commentParams.index;
  const comment = commentParams.comment.toString().trim();

  if (!helpers.isValidId(productId) || (index !== 0 && !helpers.isValidId(index)) || comment === '') {
    return false;
  }

  return {
    productId,
    commentValid: comment,
    index,
  };
}

function validValueReportParams(reportParams) {
  const { productId } = reportParams;
  const subject = helpers.validString(reportParams.subject);
  const details = helpers.validString(reportParams.details);

  if (!helpers.isValidId(productId) || subject === null || details === null) {
    return false;
  }

  return {
    productId,
    subjectValid: subject,
    detailsValid: details,
  };
}

function validValueCheckNewItemParams(checkNewItemParams) {
  const categoryId = checkNewItemParams.categoryId ? checkNewItemParams.categoryId : 0;
  const { lastId } = checkNewItemParams;

  if ((categoryId !== 0 && !helpers.isValidId(categoryId)) || !helpers.isValidId(lastId)) {
    return false;
  }

  return {
    categoryIdValid: categoryId,
    lastId,
  };
}

function validEditProductParams(editProductParams) {
  const {
    name, price, described, shipsFrom,
    condition, weight,
  } = editProductParams;

  const nameValid = helpers.validString(name);
  const priceValid = helpers.validInteger(price);
  const describedValid = helpers.isExist(described) ? helpers.validString(described) : 0;
  const shipsFromValid = helpers.isExist(shipsFrom) ? helpers.validString(shipsFrom) : 0;
  const conditionValid = helpers.isExist(condition) ? helpers.validInteger(condition) : '';
  const weightValid = helpers.isExist(weight) ? helpers.validString(weight) : 0;
  return {
    nameValid,
    priceValid,
    describedValid,
    shipsFromValid,
    conditionValid,
    weightValid,
  };
}

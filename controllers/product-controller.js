const { helpers, constants } = global;

const productService = require('../services/product-service');

exports.getProductList = (req, res) => {
  const data = req.body;
  if (!data) {
    helpers.sendResponse(
      res, constants.statusCode.notFound,
      constants.response.paramValueInvalid,
    );
  } else if (!helpers.isExist(data.count) || !helpers.isExist(data.index)) {
    helpers.sendResponse(
      res, constants.statusCode.notFound,
      constants.response.paramNotEnough,
    );
  } else {
    const count = helpers.validInteger(data.count);
    const validValueParams = validValueProductsParams(data);
    if (count === null) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramTypeInvalid,
      );
    } else if (!validValueParams) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramValueInvalid,
      );
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
        helpers.sendResponse(
          res, constants.statusCode.ok,
          responseData,
        );
      });
    }
  }
};

exports.getProductDetail = (req, res) => {
  const data = req.body;

  if (!data) {
    helpers.sendResponse(
      res, constants.statusCode.notFound,
      constants.response.paramValueInvalid,
    );
  } else if (!helpers.isExist(data.id)) {
    helpers.sendResponse(
      res, constants.statusCode.notFound,
      constants.response.paramNotEnough,
    );
  } else {
    const { id, token } = data;
    if (!helpers.isValidId(id)) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramValueInvalid,
      );
    } else {
      const user = helpers.getUserFromToken(token);
      const userId = user ? user.id : 0;
      productService.getProductDetail(
        id, userId,
        (responseData) => {
          helpers.sendResponse(
            res, constants.statusCode.ok,
            responseData,
          );
        },
      );
    }
  }
};

exports.getCommentProduct = (req, res) => {
  const data = req.body;

  if (!data) {
    helpers.sendResponse(
      res, constants.statusCode.notFound,
      constants.response.paramValueInvalid,
    );
  } else {
    const { productId, token } = data;
    if (!helpers.isExist(productId)) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramNotEnough,
      );
    } else if (!helpers.isValidId(productId)) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramValueInvalid,
      );
    } else {
      const user = helpers.getUserFromToken(token);
      const userId = user ? user.id : 0;
      productService.getProductCommentList(
        productId, userId,
        (responseData) => {
          helpers.sendResponse(
            res, constants.statusCode.ok,
            responseData,
          );
        },
      );
    }
  }
};

exports.postCommentProduct = (req, res) => {
  const data = req.body;

  if (!data) {
    helpers.sendResponse(
      res, constants.statusCode.notFound,
      constants.response.paramValueInvalid,
    );
  } else {
    const { productId, comment, index } = data;
    const validValueParams = validValueCommentParams(data);
    if (!helpers.isExist(productId) || !helpers.isExist(comment) || !helpers.isExist(index)) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramNotEnough,
      );
    } else if (typeof comment !== 'string' && !(comment instanceof String)) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramTypeInvalid,
      );
    } else if (!validValueParams) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramValueInvalid,
      );
    } else {
      productService.addProductComment(
        productId, validValueParams.commentValid, index, req.user.id,
        (responseData) => {
          helpers.sendResponse(
            res, constants.statusCode.ok,
            responseData,
          );
        },
      );
    }
  }
};

exports.deleteProduct = (req, res) => {
  const data = req.body;

  if (!data) {
    helpers.sendResponse(
      res, constants.statusCode.notFound,
      constants.response.paramValueInvalid,
    );
  } else {
    const productId = data.id;

    if (!helpers.isExist(productId)) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramNotEnough,
      );
    } else if (!helpers.isValidId(productId)) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramValueInvalid,
      );
    } else {
      productService.deleteProduct(
        productId, req.user.id,
        (responseData) => {
          helpers.sendResponse(
            res, constants.statusCode.ok,
            responseData,
          );
        },
      );
    }
  }
};

exports.likeProduct = (req, res) => {
  const data = req.body;

  if (!data) {
    helpers.sendResponse(
      res, constants.statusCode.notFound,
      constants.response.paramValueInvalid,
    );
  } else {
    const { productId } = data;

    if (!helpers.isExist(productId)) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramNotEnough,
      );
    } else if (!helpers.isValidId(productId)) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramValueInvalid,
      );
    } else {
      productService.likeProduct(
        productId, req.user.id,
        (responseData) => {
          helpers.sendResponse(
            res, constants.statusCode.ok,
            responseData,
          );
        },
      );
    }
  }
};

exports.reportProduct = (req, res) => {
  const data = req.body;

  if (!data) {
    helpers.sendResponse(
      res, constants.statusCode.notFound,
      constants.response.paramValueInvalid,
    );
  } else {
    const { productId, subject, details } = data;

    if (!helpers.isExist(productId) || !helpers.isExist(subject) || !helpers.isExist(details)) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramNotEnough,
      );
    } else if ((typeof subject !== 'string' && !(subject instanceof String))
    || (typeof details !== 'string' && !(details instanceof String))) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramTypeInvalid,
      );
    } else if (!validValueReportParams(data)) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramValueInvalid,
      );
    } else {
      const { subjectValid, detailsValid } = validValueReportParams(data);

      productService.reportProduct(
        productId, subjectValid, detailsValid, req.user.id,
        (responseData) => {
          helpers.sendResponse(
            res, constants.statusCode.ok,
            responseData,
          );
        },
      );
    }
  }
};

exports.getProductListMyLike = (req, res) => {
  const data = req.body;

  if (!data) {
    helpers.sendResponse(
      res, constants.statusCode.notFound,
      constants.response.paramValueInvalid,
    );
  } else {
    const { count, index } = data;

    if (!helpers.isExist(count) || !helpers.isExist(index)) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramNotEnough,
      );
    } else {
      const countValid = helpers.validInteger(count);
      const indexValid = helpers.validInteger(index);

      if (countValid === null || indexValid === null) {
        helpers.sendResponse(
          res, constants.statusCode.notFound,
          constants.response.paramTypeInvalid,
        );
      } else if (indexValid < 0 || countValid <= 0) {
        helpers.sendResponse(
          res, constants.statusCode.notFound,
          constants.response.paramValueInvalid,
        );
      } else {
        productService.getMyLikeProductList(
          index, countValid, req.user.id,
          (responseData) => {
            helpers.sendResponse(
              res, constants.statusCode.ok,
              responseData,
            );
          },
        );
      }
    }
  }
};

exports.getNewItemNumber = (req, res) => {
  const data = req.body;

  if (!data) {
    helpers.sendResponse(
      res, constants.statusCode.notFound,
      constants.response.paramValueInvalid,
    );
  } else {
    const { lastId } = data;

    const validValueParams = validValueCheckNewItemParams(data);
    if (!helpers.isExist(lastId)) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramNotEnough,
      );
    } else if (!validValueParams) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramValueInvalid,
      );
    } else {
      const { categoryIdValid } = validValueParams;

      productService.getNewItemNumber(
        lastId, categoryIdValid,
        (responseData) => {
          helpers.sendResponse(
            res, constants.statusCode.ok,
            responseData,
          );
        },
      );
    }
  }
};

exports.addProduct = (req, res) => {
  const data = req.body;
  if (!data) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramValueInvalid);
  } else {
    const {
      price, name, categoryId, shipsFrom, shipsFromId, image, video, thumb,
      condition, brandId, productSizeId, described, weight, dimension,
    } = data;

    if (!helpers.isExist(price) || !helpers.isExist(name)
      || !helpers.isExist(categoryId) || !helpers.isExist(shipsFrom)
      || !helpers.isExist(shipsFromId) || !helpers.isExist(condition)) {
      helpers.sendResponse(
        res, constants.statusCode.notFound,
        constants.response.paramNotEnough,
      );
    } else {
      const priceValid = helpers.validInteger(price);
      const conditionValid = helpers.validInteger(condition);
      const nameValid = helpers.validString(name);
      const shipsFromValid = helpers.validString(shipsFrom);

      if (priceValid === null || conditionValid === null
        || nameValid === null || shipsFromValid === null) {
        helpers.sendResponse(
          res, constants.statusCode.notFound,
          constants.response.paramTypeInvalid,
        );
      } else if (!helpers.isValidId(categoryId)
        || (helpers.isExist(brandId) && !helpers.isValidId(brandId))
        || (helpers.isExist(productSizeId) && !helpers.isValidId(productSizeId))
        || name.length > 30) {
        helpers.sendResponse(
          res, constants.statusCode.notFound,
          constants.response.paramValueInvalid,
        );
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
        productService.addProduct(
          dataValid, req.user.id,
          (responseData) => {
            helpers.sendResponse(
              res, constants.statusCode.ok,
              responseData,
            );
          },
        );
      }
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
    || !helpers.isValidId(index)
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
  const { productId, index } = commentParams;
  const comment = commentParams.comment.trim();

  if (!helpers.isValidId(productId) || !helpers.isValidId(index) || comment === '') {
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
  const subject = reportParams.subject.trim();
  const details = reportParams.details.trim();

  if (!helpers.isValidId(productId) || subject === '' || details === '') {
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


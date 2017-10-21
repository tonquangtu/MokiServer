const { helpers, constants } = global;

const sizeService = require('../services/size-service');

exports.getSizes = (req, res) => {
  const data = req.body;

  if (!data) {
    helpers.sendResponse(res, constants.response.paramValueInvalid);
  }

  const categoryId = data.categoryId ? data.categoryId : 0;

  if (categoryId === 0) {
    sizeService.getSizes((responseData) => {
      helpers.sendResponse(res, responseData);
    });
  }
  if (categoryId && categoryId.length !== 24) {
    helpers.sendResponse(res, constants.response.paramValueInvalid);
  } else {
    sizeService.getSizesByCategoryId(categoryId, (responseData) => {
      helpers.sendResponse(res, responseData);
    });
  }
};

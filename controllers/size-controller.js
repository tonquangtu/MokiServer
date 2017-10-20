const { helpers, constants } = global;

const sizeService = require('../services/size-service');

exports.getSizes = (req, res) => {
  const categoryId = req.body.id;

  if (!categoryId || categoryId === '') {
    sizeService.getSizes((responseData) => {
      helpers.sendResponse(res, responseData);
    });
  } if (categoryId && categoryId.length < 24) {
    helpers.sendResponse(res, constants.response.paramValueInvalid);
  } else {
    sizeService.getSizesByCategoryId(categoryId, (responseData) => {
      helpers.sendResponse(res, responseData);
    });
  }
};

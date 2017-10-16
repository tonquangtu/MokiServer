const { helpers, constants } = global;

const sizeService = require('../services/size-service');

exports.getSizes = (req, res) => {
  const categoryId = req.body;

  if (!categoryId.id) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramNotEnough);
  } else if (!helpers.isValidId(categoryId.id)) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramValueInvalid);
  } else {
    sizeService.getSizeList(categoryId.id, (responseData) => {
      helpers.sendResponse(res, constants.statusCode.ok, responseData);
    });
  }


};

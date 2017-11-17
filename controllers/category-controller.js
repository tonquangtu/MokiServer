const { helpers, constants } = global;

const categoryService = require('../services/category-service');

exports.getCategories = (req, res) => {
  const reqParentId = req.body.parentId;

  if (!helpers.isExist(reqParentId)) {
    helpers.sendResponse(res, constants.response.paramNotEnough);
  } else if (reqParentId !== '' && !helpers.isValidId(reqParentId)) {
    helpers.sendResponse(res, constants.response.paramValueInvalid);
  } else {
    categoryService.getCategories(reqParentId, (responseData) => {
      helpers.sendResponse(res, responseData);
    });
  }
};

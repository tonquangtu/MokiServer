const { helpers, constants } = global;

const brandService = require('../services/brand-service');

exports.getBrands = (req, res) => {
  const data = req.body;

  if (!data) {
    helpers.sendResponse(res, constants.response.paramValueInvalid);
  } else {
    const categoryId = data.categoryId ? data.categoryId : 0;

    if (categoryId === 0) {
      brandService.getBrands((responseData) => {
        helpers.sendResponse(res, responseData);
      });
    } else if (categoryId && !helpers.isValidId(categoryId)) {
      helpers.sendResponse(res, constants.response.paramValueInvalid);
    } else {
      brandService.getBrandsByCategoryId(categoryId, (responseData) => {
        helpers.sendResponse(res, responseData);
      });
    }
  }

};

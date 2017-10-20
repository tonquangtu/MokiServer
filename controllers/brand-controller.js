const { helpers, constants } = global;

const brandService = require('../services/brand-service');

exports.getBrands = (req, res) => {
  const categoryId = req.body.id;
  if (!categoryId || categoryId === '') {
    brandService.getBrands((responseData) => {
      helpers.sendResponse(res, responseData);
    });
  } if (categoryId && categoryId.length < 24) {
    helpers.sendResponse(res, constants.response.paramValueInvalid);
  } else {
    brandService.getBrandsByCategoryId(categoryId, (responseData) => {
      helpers.sendResponse(res, responseData);
    });
  }

};

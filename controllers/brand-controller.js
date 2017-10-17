const { helpers, constants } = global;

const brandService = require('../services/brand-service');

exports.getBrands = (req, res) => {
  const categoryId = req.body.id;
  if (!categoryId || categoryId === '') {
    brandService.getBrands((responseData) => {
      helpers.sendResponse(res, constants.statusCode.ok, responseData);
    });
  } if (categoryId && categoryId.length < 24) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramValueInvalid);
  } else {
    brandService.getBrandsByCategoryId(categoryId, (responseData) => {
      helpers.sendResponse(res, constants.statusCode.ok, responseData);
    });
  }

};

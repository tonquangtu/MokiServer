const { helpers, constants } = global;

const sizeService = require('../services/size-service');

exports.getSizes = (req, res) => {
  const categoryId = req.body.id;

  // t vẫn chưa nghĩ ra cách test trường hợp là có categoryId = '' thì giải quyết ntn ???. Còn đâu t thì ok oy nhé.
  if (!categoryId || categoryId === '') {
    sizeService.getSizes((responseData) => {
      helpers.sendResponse(res, constants.statusCode.ok, responseData);
    });
  } if (categoryId && categoryId.length < 24) {
    helpers.sendResponse(res, constants.statusCode.notFound, constants.response.paramValueInvalid);
  } else {
    sizeService.getSizesByCategoryId(categoryId, (responseData) => {
      helpers.sendResponse(res, constants.statusCode.ok, responseData);
    });
  }

};

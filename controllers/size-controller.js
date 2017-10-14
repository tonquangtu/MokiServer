const { helpers, constants } = global;

const sizeService = require('../services/size-service');

exports.getListSizes = (req, res) => {
  const sizeId = req.body;

  sizeService.getListSizes(sizeId, (responseData) => {
    helpers.sendResponse(res, constants.statusCode.ok, responseData);
  });

};

const campaignService = require('../services/campaign-service');

const { constants, helpers } = global;

exports.getAllCampaigns = (res, req) => {
  let statusCode;
  campaignService.getAllCampaigns((response) => {
    statusCode = constants.statusCode.ok;
    if (response.code === constants.response.campaignNotFound.code) {
      statusCode = constants.statusCode.notFound;
    } else if (response.code === constants.response.systemError.code) {
      statusCode = constants.statusCode.systemError;
    }
    helpers.sendResponse(res, statusCode, response);
  });
};

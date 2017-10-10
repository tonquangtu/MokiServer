const campaignService = require('../services/campaign-service');

const { constants, helpers } = global;

exports.getAllCampaigns = (req, res) => {
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

exports.getNewestCampaigns = (req, res) => {
  let statusCode;
  campaignService.getNewestCampaigns((response) => {
    statusCode = constants.statusCode.ok;
    if (response.code === constants.response.campaignNotFound.code) {
      statusCode = constants.statusCode.notFound;
    } else if (response.code === constants.response.systemError.code) {
      statusCode = constants.statusCode.systemError;
    }
    helpers.sendResponse(res, statusCode, response);
  });
};

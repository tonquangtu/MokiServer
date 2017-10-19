const campaignService = require('../services/campaign-service');

const { helpers } = global;

exports.getAllCampaigns = (req, res) => {
  campaignService.getAllCampaigns((response) => {
    helpers.sendResponse(res, response);
  });
};

exports.getNewestCampaigns = (req, res) => {
  campaignService.getNewestCampaigns((response) => {
    helpers.sendResponse(res, response);
  });
};

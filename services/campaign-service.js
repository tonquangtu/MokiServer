const campaignRepo = require('../repositories/campaign-repository');

const { constants, logger } = global;

exports.getAllCampaigns = (callback) => {
  const promise = campaignRepo.getAllCampaigns();
  doCampaignsPromise(promise, callback);
};

exports.getNewestCampaigns = (callback) => {
  const limit = constants.campaigns_limit;
  const promise = campaignRepo.getNewestCampaigns(limit);
  doCampaignsPromise(promise, callback);
};

function doCampaignsPromise(campaignPromise, callback) {
  let response;
  campaignPromise.then((campaigns) => {
    if (!campaigns || campaigns.length < 1) {
      return callback(constants.response.campaignNotFound);
    }

    const responseData = [];
    campaigns.forEach((campaign) => {
      responseData.push({
        id: campaign.id,
        name: campaign.name,
        banner: campaign.banner,
      });
    });

    response = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data: responseData,
    };
    return callback(response);
  }).catch((err) => {
    logger.error('Error at function doCampaignsPromise at campaign-service.\n', err);
    return callback(constants.response.systemError);
  });
}

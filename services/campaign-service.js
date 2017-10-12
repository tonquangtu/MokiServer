const campaignRepo = require('../repositories/campaign-repository');

const { constants } = global;

exports.getAllCampaigns = (callback) => {
  const promise = campaignRepo.getAllCampaigns();
  processCampaigns(promise, callback);
};

exports.getNewestCampaigns = (callback) => {
  const limit = constants.campaigns_limit;
  const promise = campaignRepo.getNewestCampaigns(limit);
  processCampaigns(promise, callback);
};

function processCampaigns(campaignPromise, callback) {
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
    console.log(err);
    return callback(constants.response.systemError);
  });
}

const campaignRepo = require('../repositories/campaign-repository');

const { constants } = global;

exports.getAllCampaigns = (callback) => {
  let response;
  const promise = campaignRepo.getAllCampaigns();
  promise.then((campaigns) => {
    if (!campaigns || campaigns.length < 1) {
      response = {
        code: constants.response.campaignNotFound.code,
        message: constants.response.campaignNotFound.message,
        data: null,
      };
      return callback(response);
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
    response = {
      code: constants.response.systemError.code,
      message: constants.response.systemError.message,
      data: null,
    };
    return callback(response);
  });
};

const campaignRepo = require('../repositories/campaign-repository');

exports.getAllCampaigns = (callback) => {
  const response = {};
  const campaignPromise = campaignRepo.getAllCampaigns();
  campaignPromise.then((campaigns) => {


  }).catch((err) => {

  });
};

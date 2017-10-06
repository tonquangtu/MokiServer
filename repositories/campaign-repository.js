const { Campaign } = global;

exports.getAllCampaigns = () => Campaign.find().exec();

const { Campaign } = global;

exports.getAllCampaigns = () => Campaign.find().exec();

exports.getNewestCampaigns = limit => Campaign
  .find()
  .sort({ created_at: -1 })
  .limit(limit)
  .exec();

const Product = require('../models/product');

exports.getListProducts = (categoryId, campaignId, lastId, count) => Product.find({
  categories: categoryId,
  campaigns: campaignId,
}).where('id').lt(lastId)
  .sort('-id')
  .limit(count)
  .exec();

exports.getNewItems = index => Product.find().where('id').gt(index).exec();

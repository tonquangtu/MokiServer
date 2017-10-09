const Product = require('../models/product');

const { mongoose } = global;

exports.getListProducts = (categoryId, campaignId, lastId, count) => {
  const data = {};
  const numProduct = parseInt(count, 10);
  if (campaignId > 0) {
    data.campaigns = campaignId;
  }
  if (categoryId > 0) {
    data.categories = categoryId;
  }
  if (lastId === 0) {
    return Product.find(data).sort('-id').limit(numProduct).exec();
  }
  return Product.find(data).where('id').lt(lastId).sort('-id')
    .limit(numProduct)
    .exec();
};

exports.getNewItems = (index) => {
  const newestItem = new mongoose.Types.ObjectId(index);
  return Product.find({}).where('_id').gt(newestItem).exec();
};

exports.getProductDetail = productId => Product.findById(productId).exec();

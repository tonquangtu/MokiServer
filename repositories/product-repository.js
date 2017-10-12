const Product = require('../models/product');

const { mongoose } = global;

exports.getProductList = (categoryId, campaignId, lastId, count) => {
  const data = {};
  const selectAttribute = 'name media seller price price_percent description brands created_at like comment banned';
  const numProduct = parseInt(count, 10);

  if (campaignId > 0) {
    data.campaigns = campaignId;
  }

  if (categoryId > 0) {
    data.categories = categoryId;
  }

  if (lastId === 0) {
    return Product.find(data)
      .sort({ _id: -1 })
      .limit(numProduct)
      .populate({ path: 'brands', select: 'name' })
      .populate({ path: 'seller', select: 'username avatar' })
      .select(selectAttribute)
      .exec();
  }

  return Product.find(data)
    .where('_id').lt(lastId)
    .sort({ _id: -1 })
    .limit(numProduct)
    .populate({ path: 'brands', select: 'name' })
    .populate({ path: 'seller', select: 'username avatar' })
    .select(selectAttribute)
    .exec();
};

exports.getNewItems = (index) => {
  const newestItem = new mongoose.Types.ObjectId(index);

  return Product.find({})
    .where('_id').gt(newestItem)
    .count()
    .exec();
};

exports.getProductDetail = productId => Product.findById(productId)
  .populate({ path: 'seller', select: 'username avatar' })
  .populate({ path: 'sizes', select: 'name' })
  .populate({ path: 'brands', select: 'name' })
  .populate({ path: 'categories', select: 'name' })
  .select('name media seller price price_percent description ships_from ships_from_ids condition like comment banned sizes brands categories url weight dimension campaigns created_at')
  .exec();

exports.getProductWithComment = productId => Product.findById(productId)
  .populate({ path: 'comments.commenter', select: 'username avatar' })
  .exec();

exports.getProductOfUser = userId => Product.find({ seller: userId })
  .exec();

exports.findAndUpdateCommentsProduct =
  (productId, productData, option) => Product.findByIdAndUpdate(productId, productData, option)
    .populate({ path: 'comments.commenter', select: 'username avatar' })
    .exec();

exports.deleteProduct = productId => Product.findByIdAndRemove(productId)
  .exec();

exports.findAndUpdateProduct =
  (productId, productData, option) => Product.findByIdAndUpdate(productId, productData, option)
    .exec();

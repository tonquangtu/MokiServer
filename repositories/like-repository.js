const Like = require('../models/like');

exports.getLikeUserProduct = (userId, productId) => Like.findOne({
  user: userId,
  product: productId,
}).exec();

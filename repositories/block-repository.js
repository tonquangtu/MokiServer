const Block = require('../models/block');

exports.getBlockUserProduct = (userId, productId) => Block.findOne({
  user: userId,
  product: productId,
}).exec();

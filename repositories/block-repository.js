const { Block } = global;

exports.getBlockUserProduct = (userId, productId) => Block.findOne({
  user: userId,
  product: productId,
}).exec();

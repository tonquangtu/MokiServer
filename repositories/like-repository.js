const Like = require('../models/like');

exports.getLikeUserProduct = (userId, productId) => Like.findOne({
  user: userId,
  product: productId,
}).exec();

exports.findAndUpdateLike = (like, likeData) => {
  if (!like) {
    const newLike = new Like(likeData);
    return newLike.save();
  }

  const newLike = like;
  newLike.is_liked = !like.is_liked;
  return Like.findByIdAndUpdate(like.id, newLike).exec();
};

exports.getMyLikeProductList = (userId, count, index) => Like.find({
  user: userId,
  is_liked: 1,
}).sort({ _id: -1 })
  .skip(index)
  .limit(count)
  .populate({ path: 'product', select: 'name price media' })
  .exec();

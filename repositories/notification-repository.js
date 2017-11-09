const {
  Notification,
  mongoose,
  logger,
  constants,
} = global;

exports.getNotificationsWithRealPaging = (userId, group, fromIndex, limit) => {
  const userIdObj = new mongoose.mongo.ObjectId(userId);
  return new Promise((resolve, reject) => {
    Notification.aggregate([
      { $match: { user: userIdObj } },
      { $unwind: '$contents' },
      { $match: { 'contents.group': group } },
      { $sort: { 'contents.created_at': -1 } },
      { $limit: limit },
      { $skip: fromIndex },
      { $group: { _id: '$user', badge: { $first: '$badge' }, contents: { $push: '$contents' } } },
    ], (err, results) => {
      if (err) {
        logger.error('Error in function getNotificationsWithRealPaging at notification-repository\n', err);
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};

// return a object notification only have 1 item content.
// but returned object is not mongoose object
exports.getNotification = userId =>
  Notification
    .findOne({ user: userId })
    .exec();

exports.getNotificationWithSelect = (userId, select) =>
  Notification
    .findOne({ user: userId })
    .select(select)
    .exec();

exports.setReadNotification = (userId, notificationId) => {
  const where = { user: userId, 'contents._id': notificationId };
  const set = { $set: { 'contents.$.read': constants.notification.read }, $inc: { badge: -1 } };

  return Notification.update(where, set).exec();
};

exports.saveNotification = notification => notification.save();

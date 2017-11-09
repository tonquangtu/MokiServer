const { Notification, mongoose, logger } = global;

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

exports.getNotifications = (userId, group, fromIndex, limit) => {
  let sliceOption;
  if (fromIndex === 0) {
    sliceOption = {
      $slice: -limit,
    };
  } else {
    const fromLastIndex = fromIndex + limit;
    sliceOption = {
      $slice: [-fromLastIndex, limit],
    };
  }

  return Notification
    .findOne({ user: userId, 'contents.group': group }, { contents: sliceOption })
    .exec();
};

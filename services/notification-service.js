const notificationRepo = require('../repositories/notification-repository');

const {
  constants,
  logger,
  _,
  mongoose,
} = global;

exports.getNotifications = (notifyParam, callback) => {
  const {
    userId,
    fromIndex,
    limit,
    group,
  } = notifyParam;

  notificationRepo
    .getNotificationsWithRealPaging(userId, group, fromIndex, limit)
    .then((notification) => {
      if (!notification || !notification.contents || notification.contents.length < 1) {
        return Promise.reject(constants.response.notificationNotFound);
      }

      const { contents, badge } = notification;
      const list = contents.map((item) => {
        return {
          id: item.id,
          type: item.object_type,
          objectId: item.object_id.toString(),
          title: item.title,
          created: item.created_at,
          avatar: item.avatar,
          group: item.group,
          read: item.read,
        };
      });

      const response = {
        code: constants.response.ok.code,
        message: constants.response.ok.message,
        data: {
          badge,
          notifications: list,
        },
      };

      return callback(response);
    })
    .catch((err) => {
      let errResponse = err;
      if (err !== constants.response.notificationNotFound) {
        logger.error('Error at function getNotification in notification-service\n', err);
        errResponse = constants.response.systemError;
      }

      return callback(errResponse);
    });
};

exports.setReadNotification = (userId, notificationId, callback) => {
  notificationRepo
    .getNotification(userId)
    .then((notification) => {
      if (!notification || !notification.contents || notification.contents.length < 1) {
        return Promise.reject(constants.response.notificationNotFound);
      }

      const { badge, contents } = notification;
      const notificationIdObj = new mongoose.mongo.ObjectId(notificationId);
      const index = _.findIndex(contents, { _id: notificationIdObj });
      if (index === -1) {
        return Promise.reject(constants.response.notificationNotFound);
      }

      console.log(index);

      if (badge < 1) {
        return notification;
      }

      if (contents[index] === constants.notification.unread) {
        contents[index].read = contents.notification.read;
        notification.set({ badge: badge - 1 });
        return notificationRepo.saveNotification(notification);
      }

      return notification;
    })
    .then((notification) => {
      const response = {
        code: constants.response.ok.code,
        message: constants.response.ok.message,
        data: {
          badge: notification.badge,
        },
      };
      return callback(response);
    })
    .catch((err) => {
      let errResponse = err;
      if (err !== constants.response.notificationNotFound) {
        errResponse = constants.response.systemError;
        logger.error('Error in function setReadNotification at notification-service\n', err);
      }

      return callback(errResponse);
    });

};

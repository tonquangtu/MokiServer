const notificationRepo = require('../repositories/notification-repository');

const { constants, logger } = global;

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

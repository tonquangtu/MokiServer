const dotenv = require('dotenv');
const FCM = require('fcm-push');
const logger = require('../helpers/logger');

dotenv.config();
const serverKey = process.env.FCM_SERVER_KEY;
const fcm = new FCM(serverKey);

exports.pushNotification = (notifyParam) => {
  const {
    deviceToken,
    payload,
    title,
    body,
  } = notifyParam;

  const message = {
    to: deviceToken,
    data: payload,
    notification: {
      title,
      body,
    },
  };

  fcm
    .send(message)
    .then((response) => {
      logger.info('Push notification successful\n', response);
    })
    .catch((err) => {
      logger.error('Push notification failure\n', err);
    });
};

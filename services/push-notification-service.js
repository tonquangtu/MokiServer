const dotenv = require('dotenv');
const FCM = require('fcm-push');

dotenv.config();
const serverKey = process.env.FCM_SERVER_KEY;
const fcm = new FCM(serverKey);
const defaultToken = 'fk0vw3mv74A:APA91bEYeYrqyYTEULqG6REqffE4wQoMsatSeLFuniU9UD7X-XWATJxUGgcWV1GlRJYWaKlBH_eWGUFHLFGbGVEY0C27QjpE3rXhW16sIii2Ss3G5xEwShJug5cGigV8YM81_nbTZele';

const param = {
  deviceToken: defaultToken,
  msgContent: {
    sender: {
      id: '123',
      username: 'ton quang tu',
    },
    message: {
      content: 'Gia ca cua no the nao a',
    },
  },
};

pushNotification(param);

function pushNotification(notifyParam) {
  const {
    deviceToken,
    msgContent,
  } = notifyParam;

  const title = msgContent.sender.username;
  const body = msgContent.message.content;

  const message = {
    to: deviceToken,
    data: msgContent,
    notification: {
      title,
      body,
    },
  };

  return fcm.send(message);
}

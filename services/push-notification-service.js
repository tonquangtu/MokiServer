const FCM = require('fcm-push');

const serverKey = process.env.FCM_SERVER_KEY;
const fcm = new FCM(serverKey);

exports.pushNotification = () => {


};

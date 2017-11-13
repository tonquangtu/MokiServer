const moment = require('moment');

const { helpers, constants, _ } = global;

module.exports = class SendToken {
  constructor(sendParam) {
    this.token = SendToken.createSendToken(sendParam);
  }

  static createSendToken(sendParam) {
    const expiredAt = helpers.getExpiredDate(constants.tokenExpired);
    const payload = Object.assign({}, sendParam, { expiredAt });
    return helpers.encodeToken(payload);
  }

  static extractToken(token, rooms) {
    const payload = helpers.decodeToken(token);
    console.log('extract token');
    if (!payload) {
      return null;
    }

    const {
      senderId,
      senderType,
      receiverId,
      roomId,
      socketId,
      expiredAt,
    } = payload;
    const now = moment(new Date());
    const expired = moment(expiredAt);

    if (now.diff(expired) > 0) {
      return null;
    }

    const room = _.find(rooms, { id: roomId });
    if (!room) {
      return null;
    }

    const joiner = _.find(room.joiners, { socketId });
    if (!joiner) {
      return null;
    }
    if (joiner.sendToken !== token) {
      return null;
    }

    return payload;
  }
};

const { _, helpers } = global;
const separator = '_';
const sizeRoomId = 4;

module.exports = class ChatRoom {
  constructor(roomId) {
    this.id = roomId;
    this.joiners = [];
  }

  findJoinerBySocketId(socketId) {
    return _.find(this.joiners, { socketId });
  }

  findJoinerByUserId(userId) {
    return _.filter(this.joiners, { userId });
  }

  addJoiner(socketId, userId, sendToken) {
    if (helpers.isExist(socketId) && helpers.isExist(userId) && helpers.isValidId(userId)) {
      this.joiners.push({
        socketId,
        userId,
        sendToken,
      });
    }
  }

  removeJoiner(socketId) {
    const index = _.findIndex(this.joiners, { socketId });
    if (index !== -1) {
      this.joiners.splice(index, 1);
    }
  }

  static getRoomId(roomParam) {
    const {
      userId,
      partnerId,
      partnerRole,
      productId,
    } = roomParam;

    // return `${userId}${separator}${partnerId}${separator}${partnerRole}${separator}${productId}`;
    return userId + separator + partnerId + separator + partnerRole + separator + productId;
  }

  static extractRoomId(roomId) {
    if (!helpers.isExist(roomId)) {
      return null;
    }

    const splits = roomId.split(separator);
    if (splits.length < sizeRoomId) {
      return null;
    }

    return {
      userId: splits[0],
      partnerId: splits[1],
      partnerRole: splits[2],
      productId: splits[3],
    };
  }
};

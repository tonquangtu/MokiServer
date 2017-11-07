const socketIo = require('socket.io');
const consRepo = require('../repositories/conversation-repository');
const consService = require('../services/conversation-service');
const ChatRoom = require('../models/domain-models/chat-room');
const SendToken = require('../models/domain-models/send-token');

const {
  logger,
  helpers,
  constants,
  _,
} = global;

let io = null;
const activeUsers = [];
const rooms = [];

exports.initSocketIo = (server) => {
  console.log('init socketio');
  io = socketIo(server);
  initSocketEvent();
};

function initSocketEvent() {
  io.on(constants.socketEvent.connection, (socket) => {
    logger.info(`socket connected: ${socket.id}`);

    socket.on(constants.socketEvent.joinRoomRequest, (data) => {
      joinRoom(socket, data);
    });

    socket.on(constants.socketEvent.message, (data) => {
      receiveMessage(socket, data);
    });

    socket.on(constants.socketEvent.updateMsgStatus, (data) => {
      updateMsgStatus(socket, data);
    });

    socket.on(constants.socketEvent.disconnection, () => {
      disconnectSocket(socket);
    });
  });
}

function receiveMessage(socket, data) {
  const {
    sendToken,
    message,
  } = data;

  const sendParam = SendToken.extractToken(sendToken);
  if (!sendParam) {
    resendMessage(socket, constants.response.sendTokenInvalid);
    return;
  }

  const {
    sender,
    receiverId,
    roomId,
  } = sendParam;
  const {
    userId,
    partnerId,
    partnerRole,
    productId,
  } = ChatRoom.extractRoomId(roomId);

  const consParam = {
    userId,
    partnerId,
    partnerRole,
    productId,
    message,
    senderType: sender.type,
  };

  consService.setConsHavePermission(consParam, (response) => {
    if (response.code !== constants.response.code.ok) {
      resendMessage(socket, response);
      return;
    }

    const forwardContent = {
      productId,
      receiverId,
      sender: {
        id: sender.id,
        username: sender.username,
        avatar: sender.avatar,
      },
      message: {
        id: response.data.messageId,
        content: message,
        unread: response.data.unread,
        sentAt: response.data.createdAt,
      },
    };

    forwardMessage(socket, roomId, forwardContent);

    if (!isJoinRoom(receiverId)) {
      pushNotification(socket, roomId, forwardContent);
    }
  });
}

function forwardMessage(socket, roomId, sendContent) {
  socket.broadcast.to(roomId).emit(constants.socketEvent.message, sendContent);
}

function resendMessage(socket, resendContent) {
  socket.emit(resendContent);
}

function updateMsgStatus(socket, data) {
  const {
    sendToken,
    messageId,
  } = data;

  const sendParam = SendToken.extractToken(sendToken);
  if (!sendParam) {
    resendMessage(socket, constants.response.sendTokenInvalid);
    return;
  }

  const {
    roomId,
  } = sendParam;
  const {
    userId,
    partnerId,
    productId,
  } = ChatRoom.extractRoomId(roomId);

  const status = constants.conversation.status.read;
  let conversation = null;

  consRepo
    .findConversation(userId, partnerId, productId)
    .then((consRaw) => {
      if (!consRaw) {
        return Promise.reject(constants.response.paramValueInvalid);
      }

      conversation = consRaw;
      return consRepo.updateMessageStatus(consRaw.id, messageId, status); // careful with id type!
    })
    .then(() => {
      if (conversation.num_unread_message > 0) {
        conversation.num_unread_message -= 1;
        return consRepo.saveConversation(conversation);
      }
      return null;
    })
    .then(() => {
      logger.info('Updated message and conversation status');
      resendMessage(socket, constants.response.ok);
    })
    .catch((err) => {
      let errRes = err;
      if (err !== constants.response.paramValueInvalid) {
        errRes = constants.response.systemError;
        logger.error('Error at updateMsgStatus in realtime-chat-service\n', err);
      }
      resendMessage(socket, errRes);
    });
}

function disconnectSocket(socket) {}

function joinRoom(socket, data) {
  const {
    token,
    receiverId,
    productId,
  } = data;
  const sender = helpers.getUserFromToken(token);

  if (!isValidJoinRoomParam(sender, receiverId, productId)) {
    sendJoinRoomResponse(constants.response.paramValueInvalid, socket, null);
    return;
  }

  consService
    .checkSendPermission(sender.id, sender.role, receiverId, productId)
    .then((joiner) => {
      const joinParam = {
        socket,
        receiverId,
        sender: {
          id: sender.id,
          username: sender.username,
          avatar: sender.avatar,
          type: joiner.senderType,
        },
        roomParam: {
          productId,
          userId: joiner.userId,
          partnerId: joiner.partnerId,
          partnerRole: joiner.partnerRole,
        },
      };
      const sendToken = doJoinRoom(joinParam);
      sendJoinRoomResponse(null, socket, sendToken);
    })
    .catch((err) => {
      sendJoinRoomResponse(err, socket, null);
    });
}

function doJoinRoom(joinParam) {
  const {
    socket,
    receiverId,
    sender,
    roomParam,
  } = joinParam;

  const roomId = ChatRoom.getRoomId(roomParam);
  let room = _.find(rooms, { id: roomId });

  if (!room) {
    room = new ChatRoom(roomId);
  }
  const sendParam = {
    sender,
    receiverId,
    roomId: room.id,
    socketId: socket.id,
  };
  const sendToken = SendToken.createSendToken(sendParam);

  room.addJoiner(socket.id, sender.id, sendToken);
  socket.join(room.id);
  rooms.push(room);

  return sendToken;
}

function sendJoinRoomResponse(err, socket, sendToken) {
  let response = null;
  if (err) {
    response = err;
  } else {
    response = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data: {
        sendToken,
      },
    };
  }

  socket.emit(constants.socketEvent.joinRoomResponse, response);
}

function isJoinRoom(socket, roomId) {
  return false;
}

function pushNotification(socket, roomId, sendContent) {
  logger.info(`Push notification: ${sendContent.receiverId}`);
}

function validMsgParam(sender, receiverId, productId, message) {
  if (!isValidJoinRoomParam(sender, receiverId, productId)) {
    return null;
  }

  if (!helpers.isExist(message)) {
    return null;
  }

  const trimMsg = message.toString().trim();
  if (trimMsg.length < 1) {
    return null;
  }

  return {
    productId,
    receiverId,
    senderId: sender.id,
    senderRole: sender.role,
    message: trimMsg,
  };
}

function isValidJoinRoomParam(sender, receiverId, productId) {
  if (!isEnoughJoinRoomParam(sender, receiverId, productId)) {
    return false;
  }

  return (helpers.isValidId(receiverId)
    && (productId === 0 || helpers.isValidId(productId)));
}

function isEnoughJoinRoomParam(sender, receiverId, productId) {
  return (helpers.isExist(sender)
    && helpers.isExist(receiverId)
    && helpers.isExist(productId));
}

function createSendToken(sendParam) {
  const {
    roomId,
    socketId,
    senderId,
    receiverId,
    productId,
  } = sendParam;
  const expiredAt = helpers.getExpiredDate(constants.tokenExpired);

  const payload = {
    roomId,
    socketId,
    senderId,
    receiverId,
    productId,
    expiredAt,
  };

  return helpers.encodeToken(payload);
}

const conversationRepo = require('../repositories/conversation-repository');
const userRepo = require('../repositories/user-repository');
const productRepo = require('../repositories/product-repository');

const {
  constants,
  helpers,
  _,
  logger,
  mongoose,
} = global;

exports.getConversations = (userId, fromIndex, limit, callback) => {
  conversationRepo
    .getConversations(userId, fromIndex, limit)
    .then((conversations) => {
      const response = conversationsToResponse(userId, conversations);
      return callback(response);
    })
    .catch((err) => {
      logger.error('Error at function getConversations at conversation-service\n', err);
      return callback(constants.response.systemError);
    });
};

exports.getConversationDetail = (conversationInfo, callback) => {
  const {
    userId1,
    userId2,
    productId,
    conversationId,
    fromIndex,
    limit,
  } = conversationInfo;

  conversationRepo
    .getConversation(conversationId, fromIndex, limit)
    .then((consRaw) => {
      const response = getConsDetailResponse(userId1, userId2, productId, consRaw);
      return callback(response);
    })
    .catch((err) => {
      logger.error('Error at function getConversation in conversation-service\n', err);
      return callback(constants.response.systemError);
    });
};

exports.setConversation = (consContent, callback) => {
  const {
    senderId,
    receiverId,
    productId,
    senderRole,
    message,
  } = consContent;
  let joiner = null;
  let isExistCons = false;
  let conversation = null;
  const now = new Date();

  this.checkSendPermission(senderId, senderRole, receiverId, productId)
    .then((joinerWithPermission) => {
      if (!joinerWithPermission) {
        return Promise.reject(constants.response.noSendPermission);
      }

      joiner = joinerWithPermission;
      return conversationRepo.findConversation(joiner.userId, joiner.partnerId, productId);
    })
    .then((consRaw) => {
      if (consRaw) {
        isExistCons = true;
        return consRaw;
      }

      isExistCons = false;
      const consInfo = {
        productId,
        userId: joiner.userId,
        partnerId: joiner.partnerId,
        partnerRole: joiner.partnerRole,
        now,
      };

      return conversationRepo.addConversation(consInfo);
    })
    .then((consRaw) => {
      if (!consRaw) {
        return null;
      }

      conversation = consRaw;
      const msgContent = {
        message,
        now,
        conversationId: consRaw.id,
        senderType: joiner.senderType,
      };
      if (isExistCons) {
        return conversationRepo.addMessage(msgContent);
      }

      return conversationRepo.createMessage(msgContent);
    })
    .then((newAddedMsg) => {
      if (!newAddedMsg) {
        return Promise.reject(constants.response.sendError);
      }

      // update last message
      conversation.last_message = {
        message,
        created_at: now,
      };
      conversation.num_unread_message += 1;

      return conversationRepo.saveConversation(conversation);
    })
    .then((savedCons) => {
      if (!savedCons) {
        return Promise.reject(constants.response.sendError);
      }

      const response = {
        code: constants.response.ok.code,
        message: constants.response.ok.message,
        data: {
          unread: constants.conversation.status.unread,
          createdAt: now,
        },
      };

      return callback(response);
    })
    .catch(err => handleSendError(err, callback));
};

exports.setConversationCheckedPermission = (consContent, callback) => {
  const {
    userId,
    partnerId,
    partnerRole,
    senderType,
    productId,
    message,
  } = consContent;
  let isExistCons = false;
  let conversation = null;
  let addedMsgId = null;
  const now = new Date();

  console.log('vao day');

  return conversationRepo
    .findConversation(userId, partnerId, productId)
    .then((consRaw) => {
      console.log(consRaw);
      if (consRaw) {
        isExistCons = true;
        return consRaw;
      }

      isExistCons = false;
      const consInfo = {
        userId,
        partnerId,
        partnerRole,
        productId,
        now,
      };

      return conversationRepo.addConversation(consInfo);
    })
    .then((consRaw) => {
      if (!consRaw) {
        return null;
      }
      console.log(consRaw);
      conversation = consRaw;
      const msgContent = {
        message,
        now,
        senderType,
        conversationId: consRaw.id,
      };
      if (isExistCons) {
        return conversationRepo.addMessage(msgContent);
      }

      return conversationRepo.createMessage(msgContent);
    })
    .then((newAddedMsg) => {
      if (!newAddedMsg) {
        return Promise.reject(constants.response.sendError);
      }

      // update last message
      addedMsgId = newAddedMsg.id;
      conversation.last_message = {
        message,
        created_at: now,
      };
      conversation.num_unread_message += 1;

      return conversationRepo.saveConversation(conversation);
    })
    .then((savedCons) => {
      if (!savedCons) {
        return Promise.reject(constants.response.sendError);
      }

      const response = {
        code: constants.response.ok.code,
        message: constants.response.ok.message,
        data: {
          messageId: addedMsgId,
          unread: constants.conversation.status.unread,
          createdAt: now,
        },
      };

      return callback(response);
    })
    .catch(err => handleSendError(err, callback));
};

exports.checkSendPermission = (senderId, senderRole, receiverId, productId) => {
  const userFieldsSelect = 'role active blocks';
  let joiner = null;
  let receiver = null;

  return new Promise((resolve, reject) => {
    userRepo
      .getUserWithOptionSelect(receiverId, userFieldsSelect)
      .then((receiverRaw) => {
        receiver = isBlockedSender(senderId, receiverRaw);
        if (!receiver) {
          return null;
        }

        if (!productId) {
          joiner = checkSendPermissionWithAdmin(senderId, senderRole, receiver);
          return null;
        }

        return productRepo.getProductWithOptionSelect(productId, 'seller');
      })
      .then((product) => {
        if (product) {
          joiner = checkSendPermissionWithSeller(senderId, receiver, product);
        }

        if (!joiner) {
          return reject(constants.response.noSendPermission);
        }

        return resolve(joiner);
      })
      .catch((err) => {
        logger.error('Error at isSendPermission in conversation-service\n', err);
        return reject(constants.response.systemError);
      });
  });
};

exports.setReadMessages = (consParam, callback) => {
  const { userId, partnerId, productId } = consParam;
  let consTemp = null;

  conversationRepo
    .findConversation(userId, partnerId, productId)
    .then((conversation) => {
      if (!conversation) {
        return Promise.reject(constants.response.conversationNotFound);
      }

      consTemp = conversation;
      return conversationRepo.setReadMessages(conversation.id);
    })
    .then(() => {
      consTemp.set({ num_unread_message: 0 });
      return conversationRepo.saveConversation(consTemp);
    })
    .then(() => callback(constants.response.ok))
    .catch((err) => {
      let errResponse = err;
      if (err !== constants.response.conversationNotFound) {
        errResponse = constants.response.systemError;
      }

      return callback(errResponse);
    });
};

function conversationsToResponse(userId, conversations) {
  if (!conversations || conversations.length < 1) {
    return constants.response.conversationNotFound;
  }

  const data = conversations.map((conversation) => {
    const {
      user,
      partner,
      product,
    } = conversation;

    const lastMessage = conversation.last_message;
    const countUnreadMes = conversation.num_unread_message;
    let unreadLastMes = constants.conversation.status.unread;
    if (countUnreadMes < 1) {
      unreadLastMes = constants.conversation.status.read;
    }

    let resPartner;
    if (userId === user.id) {
      resPartner = {
        id: partner.id,
        username: partner.username,
        avatar: partner.avatar,
      };
    } else {
      resPartner = {
        id: user.id,
        username: partner.username,
        avatar: user.avatar,
      };
    }

    let productImage = null;
    if (product.media.type === constants.product.media.type.image) {
      productImage = product.media.urls[0];
    }

    return {
      id: conversation.id,
      partner: resPartner,
      product: {
        id: product.id,
        name: product.name,
        image: productImage,
        price: product.price,
      },
      lastMessage: {
        message: lastMessage.message,
        created: lastMessage.created_at,
        unread: unreadLastMes,
      },
      numNewMessage: countUnreadMes,
    };
  });

  return {
    code: constants.response.ok.code,
    message: constants.response.ok.message,
    data,
  };
}

function getConsDetailResponse(userId1, userId2, productId, consRaw) {
  if (!consRaw || !consRaw.contents || consRaw.contents.length < 1) {
    return constants.response.conversationNotFound;
  }

  const consMeta = consRaw.conversation;
  const msgContents = consRaw.contents;
  const { user, partner, product } = consMeta;
  if (((user.id === userId1 && partner.id === userId2)
      || (user.id === userId2 && partner.id === userId1))
    && product.id === productId) {
    let productImage = null;
    if (product.media.type === constants.product.media.type.image) {
      productImage = product.media.urls[0];
    }

    const chats = [];
    for (let i = msgContents.length - 1; i >= 0; i -= 1) {
      const content = msgContents[i];
      let sender;
      if (content.sender_type === constants.conversation.sender.user) {
        sender = {
          id: user.id,
          username: user.username,
        };
      } else {
        sender = {
          id: partner.id,
          username: partner.username,
        };
      }

      chats.push({
        message: content.message,
        unread: content.unread,
        created: content.created_at,
        sender,
      });
    }

    return {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      conversation: chats,
      product: {
        name: product.name,
        price: product.price,
        image: productImage,
        sellerId: product.seller,
      },
    };
  }

  return constants.response.conversationNotFound;
}


function isBlockedSender(senderId, receiverRaw) {
  if (!receiverRaw || !receiverRaw.active) {
    return null;
  }

  const senderIdObj = new mongoose.mongo.ObjectId(senderId);
  const blockedIndex = _.findIndex(receiverRaw.blocks, { user: senderIdObj });

  if (blockedIndex !== -1) {
    return null;
  }

  return {
    id: receiverRaw.id,
    role: receiverRaw.role,
  };
}

function checkSendPermissionWithAdmin(senderId, senderRole, receiver) {
  let joiner = null;
  if (senderRole === constants.role.user && receiver.role === constants.role.admin) {
    joiner = {
      userId: senderId,
      partnerId: receiver.id,
      senderType: constants.conversation.sender.user,
      partnerRole: constants.conversation.partnerRole.admin,
    };
  } else if (senderRole === constants.role.admin) {
    joiner = {
      userId: receiver.id,
      partnerId: senderId,
      senderType: constants.conversation.sender.partner,
      partnerRole: constants.conversation.partnerRole.admin,
    };
  }

  return joiner;
}

function checkSendPermissionWithSeller(senderId, receiver, product) {
  let joiner = null;
  const sellerId = product.seller.toString();

  if (receiver.id === sellerId) {
    joiner = {
      userId: senderId,
      partnerId: receiver.id,
      senderType: constants.conversation.sender.user,
      partnerRole: constants.conversation.partnerRole.seller,
    };
  } else if (senderId === sellerId) {
    joiner = {
      userId: receiver.id,
      partnerId: senderId,
      senderType: constants.conversation.sender.partner,
      partnerRole: constants.conversation.partnerRole.seller,
    };
  }

  return joiner;
}

function handleSendError(err, callback) {
  console.log(err);
  if (err === constants.response.noSendPermission || err === constants.response.sendError) {
    return callback(err);
  }

  logger.error('Error at setConversation in conversation-service\n', err);
  return callback(constants.response.systemError);
}

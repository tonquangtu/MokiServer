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
      console.log(consRaw);
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
  const userFieldsSelect = 'role active blocks';
  let joiner = null;
  let receiver = null;
  let isExistCons = false;

  userRepo
    .getUserWithOptionSelect(receiverId, userFieldsSelect)
    .then((receiverRaw) => {
      receiver = checkSendPermission(senderId, receiverRaw);
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
        return Promise.reject(new Error(null, constants.response.noSendPermission.code));
      }

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
        message,
        userId: joiner.userId,
        partnerId: joiner.partnerId,
        partnerRole: joiner.partnerRole,
      };

      return conversationRepo.addConversation(consInfo);
    })
    .then((consRaw) => {
      if (!consRaw) {
        return null;
      }

      const msgContent = {
        message,
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
        return Promise.reject(new Error(null, constants.response.sendError.code));
      }
      const response = {
        code: constants.response.ok.code,
        message: constants.response.ok.message,
        data: {
          unread: constants.conversation.status.unread,
        },
      };

      return callback(response);
    })
    .catch(err => handleSendError(err, callback));
};

function conversationsToResponse(userId, conversations) {
  if (!conversations || conversations.length < 1) {
    return constants.response.conversationNotFound;
  }

  const data = [];
  conversations.forEach((conversation) => {
    const {
      user,
      partner,
      product,
    } = conversation;
    const lastMessage = conversation.last_message;
    const countUnreadMes = conversation.num_unread_message;

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
    if (product.media.type === constants.product.media.image) {
      productImage = product.media.urls[0];
    }

    data.push({
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
        unread: lastMessage.unread,
      },
      numNewMessage: countUnreadMes,
    });
  });

  return {
    code: constants.response.ok,
    message: constants.response.message,
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
    if (product.media.type === constants.product.media.image) {
      productImage = product.media.urls[0];
    }

    const conversation = [];
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

      conversation.push({
        message: content.message,
        unread: content.unread,
        created: content.created_at,
        sender,
      });
    }

    return {
      conversation,
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

function checkSendPermission(senderId, receiverRaw) {
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
  let joinerId = null;
  if (senderRole === constants.role.user && receiver.role === constants.role.admin) {
    joinerId = {
      userId: senderId,
      partnerId: receiver.id,
      senderType: constants.conversation.sender.user,
      partnerRole: constants.conversation.partnerRole.admin,
    };
  } else if (senderRole === constants.role.admin) {
    joinerId = {
      userId: receiver.id,
      partnerId: senderId,
      senderType: constants.conversation.sender.partner,
      partnerRole: constants.conversation.partnerRole.admin,
    };
  }

  return joinerId;
}

function checkSendPermissionWithSeller(senderId, receiver, product) {
  let joiner = null;
  const sellerId = product.seller.str;

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
  if (err.id) {
    logger.info('Function setConversation in conversation-service\n', err);
    const code = err.id;
    if (code === constants.response.noSendPermission.code) {
      return callback(constants.response.noSendPermission);
    } else if (code === constants.response.sendError.code) {
      return callback(constants.response.sendError);
    }
  }
  logger.error('Error at setConversation in conversation-service\n', err);
  return callback(constants.response.systemError);
}

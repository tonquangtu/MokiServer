const {
  Conversation,
  Message,
  constants,
  mongoose,
  logger,
} = global;

exports.getConversations = (userId, fromIndex, limit) =>
  Conversation
    .find({ $or: [{ user: userId }, { partner: userId }] })
    .sort({ 'last_message.created_at': -1 })
    .skip(fromIndex)
    .limit(limit)
    .populate({ path: 'user', select: 'username avatar' })
    .populate({ path: 'partner', select: 'username avatar' })
    .populate({ path: 'product', select: 'name media price' })
    .exec();

exports.getConversation = (conversationId, fromIndex, limit) => {
  let sliceOption;
  if (fromIndex === 0) {
    sliceOption = {
      $slice: -limit,
    };
  } else {
    const fromLastIndex = fromIndex + limit;
    sliceOption = {
      $slice: [-fromLastIndex, limit],
    };
  }

  return Message
    .findOne({ conversation: conversationId }, { contents: sliceOption })
    .populate({
      path: 'conversation',
      select: 'user partner product',
      populate: [
        {
          path: 'user',
          select: 'username',
        },
        {
          path: 'partner',
          select: 'username',
        },
        {
          path: 'product',
          select: 'name media price seller',
        },
      ],
    })
    .exec();
};

// paging for array embedded into object
// to paging, we need created_at of last message before
exports.getConversationWithPaging = (conversationId, fromIndex, limit) => {
  Message
    .aggregate([
      { $match: { conversation: new mongoose.mongo.ObjectId(conversationId) } },
      { $unwind: '$contents' }, // bung ra theo mang contents.
      { $match: { 'contents.unread': { $gt: 0 } } }, // only get array item have unread > 0
      { $sort: { 'contents.created_at': -1 } }, // sort descending by created_at
      { $limit: limit }, // get limit item
      { $skip: fromIndex }, // skip from
      { $group: { _id: '$conversation', contents: { $push: '$contents' } } }, // group into object contains
    ], (err, results) => {
      if (err) {
        logger.error('Error at getConversationWithPaging in conversation-repository\n', err);
      } else {
        logger.info(results);
      }
    });
};

exports.findConversation = (userId1, userId2, productId) =>
  Conversation
    .findOne({
      $or: [
        { $and: [{ user: userId1 }, { partner: userId2 }, { product: productId }] },
        { $and: [{ user: userId2 }, { partner: userId1 }, { product: productId }] },
      ],
    })
    .exec();

exports.saveConversation = conversation => conversation.save();

exports.addConversation = (consInfo) => {
  const {
    userId,
    partnerId,
    productId,
    partnerRole,
    message,
  } = consInfo;
  let { now } = consInfo;

  if (!now) {
    now = new Date();
  }

  const { unread } = constants.conversation.status;
  let lastMessage = null;
  let numUnreadMessage = 0;

  if (message) {
    lastMessage = {
      message,
      unread,
      created_at: now,
    };
    numUnreadMessage = 1;
  }

  const conversation = new Conversation({
    user: userId,
    partner: partnerId,
    product: productId,
    partner_role: partnerRole,
    last_message: lastMessage,
    num_unread_message: numUnreadMessage,
    created_at: now,
  });

  return conversation.save();
};

exports.createMessage = (msgContent) => {
  const {
    conversationId,
    message,
    senderType,
  } = msgContent;
  const { unread } = constants.conversation.status;
  let { now } = msgContent;

  if (!now) {
    now = new Date();
  }

  const messageObj = new Message({
    conversation: conversationId,
    contents: [{
      message,
      sender_type: senderType,
      unread,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    }],
  });

  return messageObj.save();
};

exports.addMessage = (msgContent) => {
  const {
    conversationId,
    message,
    senderType,
  } = msgContent;
  const { unread } = constants.conversation.status;
  let { now } = msgContent;

  if (!now) {
    now = new Date();
  }

  const msgItem = {
    message,
    unread,
    sender_type: senderType,
    created_at: now,
    updated_at: now,
  };

  return Message
    .update({ conversation: conversationId }, { $push: { contents: msgItem } });
};

exports.updateMessageStatus = (consId, msgId, status) => {
  const where = { conversation_id: consId, 'contents._id': msgId };
  const set = { $set: { 'contents.$.unread': status } };
  return Message.update(where, set);
};

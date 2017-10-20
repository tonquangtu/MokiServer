const { UserOrderAddress } = global;

exports.getOrderAddressList = userId => UserOrderAddress.findOne({ user: userId })
  .select('order_addresses').exec();

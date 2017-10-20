const { UserOrderAddress } = global;

exports.getOrderAddressList = userId => UserOrderAddress.findOne({ user: userId })
  .select('order_addresses').exec();

exports.findAndUpdateOrderAddress =
  (userId, userOrderAddressData, options) => UserOrderAddress.findOneAndUpdate(
    { user: userId }, userOrderAddressData, options
  ).exec();

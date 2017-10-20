const { UserOrderAddress } = global;

exports.getOrderAddressList = userId => UserOrderAddress.findOne({ user: userId })
  .select('order_addresses').exec();

exports.findAndUpdateOrderAddress =
  (userId, userOrderAddressData, options) => UserOrderAddress.findOneAndUpdate(
    { user: userId }, userOrderAddressData, options
  ).exec();

exports.addUserOrderAddress = (userOrderAddressData) => {
  const order = new UserOrderAddress(userOrderAddressData);
  return order.save();
};

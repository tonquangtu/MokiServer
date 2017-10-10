const { User } = global;

exports.getUserByPhoneNumber = phoneNumber => User.findOne({ phone_number: phoneNumber }).exec();

exports.getUserById = userId => User.findById(userId).exec();

exports.findAndUpdateUser =
  (userId, updateData) => User.findByIdAndUpdate(userId, updateData).exec();

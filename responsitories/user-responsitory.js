const { User } = global;

exports.getUserByPhoneNumber = phoneNumber => User.findOne({ phone_number: phoneNumber }).exec();
exports.getUserById = userId => User.findOne({ id: userId }).exec();


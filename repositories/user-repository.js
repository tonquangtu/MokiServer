const { User, constants } = global;

exports.getUserByPhoneNumber = phoneNumber => User.findOne({ phone_number: phoneNumber }).exec();

exports.getUserById = userId => User.findById(userId).exec();

exports.findAndUpdateUser =
  (userId, updateData, options) => User.findByIdAndUpdate(userId, updateData, options).exec();

exports.getUserByIdAndListFollow = (userId, index, count, type) => {
  const typeFollow = type === constants.followedField ? 'follows_from' : 'follows_to';
  const options = count > 0 ? { skip: index, limit: count } : { skip: index };
  return User.findById(userId)
    .populate({
      path: `${typeFollow}.user`,
      select: 'username avatar',
      options,
    }).select(typeFollow)
    .exec();
};

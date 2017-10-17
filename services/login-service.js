const userRepo = require('../repositories/user-repository');
const userService = require('../services/user-service');

const { constants, helpers } = global;

exports.login = (phoneNumber, password, callback) => {
  let loginSuccess = false;
  let response = {};
  const promise = userRepo.getUserByPhoneNumber(phoneNumber);
  promise.then((user) => {
    if (!user) {
      response = constants.response.userNotFound;
      return null;
    }
    if (!helpers.validPassword(password, user.hash_password)) {
      response = constants.response.wrongPassword;
      return null;
    }
    const payload = {
      isLogin: true,
      user: {
        id: user.id,
        username: user.username,
        phoneNumber: user.phone_number,
        role: user.role,
        url: user.url,
      },
    };
    const token = helpers.encodeToken(payload);
    return userRepo.findAndUpdateUser(user.id, { token }, { new: true });
  }).then((user) => {
    if (user) {
      loginSuccess = true;
      response = {
        code: constants.response.ok.code,
        message: constants.response.ok.message,
        data: {
          token: user.token,
          id: user.id,
          username: user.username,
          avatar: user.avatar,
        },
      };
    }
    return callback(loginSuccess, response);
  }).catch((err) => {
    console.log(err);
    loginSuccess = false;
    return callback(loginSuccess, constants.response.systemError);
  });
};

exports.logout =
  (userId, callback) => userService.updateUser(userId, { token: null }, null, callback);


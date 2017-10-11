const userRepo = require('../repositories/user-repository');
const userService = require('../services/user-service');

const { constants, helpers } = global;

exports.login = (phoneNumber, password, callback) => {
  let loginSuccess;
  let response = {};

  const promise = userRepo.getUserByPhoneNumber(phoneNumber);
  promise.then((user) => {
    if (!user) {
      loginSuccess = false;
      return callback(loginSuccess, constants.userNotFoundResponse);
    }
    if (!helpers.validPassword(password, user.hash_password)) {
      loginSuccess = false;
      response = {
        code: constants.response.wrongPassword.code,
        message: constants.response.wrongPassword.message,
        data: null,
      };
      return callback(loginSuccess, response);
    }

    loginSuccess = true;
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
    response = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data: {
        token,
        id: user.id,
        username: user.username,
        avatar: user.avatar,
      },
    };
    return callback(loginSuccess, response);
  }).catch((err) => {
    console.log(err);
    loginSuccess = false;
    return callback(loginSuccess, constants.systemErrorResponse);
  });
};

exports.logout = (userId, callback) => {
  const updateData = { token: null };
  return userService.updateUser(userId, updateData, callback);
};

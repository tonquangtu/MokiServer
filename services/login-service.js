const userRepo = require('../responsitories/user-responsitory');

const { constants, helpers } = global;

exports.login = (phoneNumber, password, callback) => {
  let loginSuccess;
  let data;
  let message;

  const promise = userRepo.getUserByPhoneNumber(phoneNumber);
  promise.then((user) => {
    if (!user) {
      loginSuccess = false;
      message = constants.message.notFoundUser;
      data = null;
      return callback(loginSuccess, message, data);
    }

    if (password !== user.hash_password) {
      loginSuccess = false;
      message = constants.message.wrongPassword;
      data = null;
      return callback(loginSuccess, message, data);
    }

    loginSuccess = true;
    message = constants.message.success;
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
    data = {
      token,
      id: user.id,
      username: user.username,
      avatar: user.avatar,
    };
    return callback(loginSuccess, message, data);
  }).catch((err) => {
    console.log(err);
    loginSuccess = false;
    message = constants.message.systemError;
    data = null;
    return callback(loginSuccess, message, data);
  });
};

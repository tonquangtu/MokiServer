const loginService = require('../services/login-service');

const { constants, helpers } = global;

exports.login = (req, res) => {
  const reqData = validateLoginData(req.body);
  if (reqData) {
    const { phoneNumber, password } = reqData;
    loginService.login(phoneNumber, password, (loginSuccess, response) => {
      helpers.sendResponse(res, response);
    });
  } else {
    helpers.sendResponse(res, constants.response.userNotFound);
  }
};

exports.logout = (req, res) => {
  loginService.logout(req.user.id, (response) => {
    helpers.sendResponse(res, response);
  });
};

function validateLoginData(loginData) {
  if (!loginData.phoneNumber || !loginData.password) return null;
  const phoneNumber = loginData.phoneNumber.trim();
  const password = loginData.password.trim();
  if (phoneNumber.length < 7 || phoneNumber.length > 11 || password.length < 1) return null;
  // if (Number.isNaN(phoneNumber)) return null;
  return {
    password,
    phoneNumber,
  };
}

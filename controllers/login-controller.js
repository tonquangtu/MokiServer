const loginService = require('../services/login-service');

const { constants, helpers } = global;

exports.login = (req, res) => {
  let statusCode;
  const reqData = validateLoginData(req.body);
  if (reqData) {
    const { phoneNumber, password } = reqData;
    loginService.login(phoneNumber, password, (loginSuccess, response) => {
      if (loginSuccess) {
        statusCode = constants.statusCode.ok;
      } else {
        statusCode = constants.statusCode.notFound;
        if (response.code === constants.response.systemError.code) {
          statusCode = constants.statusCode.systemError;
        }
      }
      helpers.sendResponse(res, statusCode, response);
    });
  } else {
    statusCode = constants.statusCode.notFound;
    const response = {
      code: constants.response.paramValueInvalid.code,
      message: constants.response.paramValueInvalid.message,
      data: null,
    };
    helpers.sendResponse(res, statusCode, response);
  }
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

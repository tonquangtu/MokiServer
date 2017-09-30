const loginService = require('../services/login-service');

const { constants, helpers } = global;

exports.login = (req, res) => {
  let statusCode;
  let responseCode;
  let responseMessage;
  let responseData;
  const reqData = validateLoginData(req.body);
  if (reqData) {
    const { phoneNumber, password } = reqData;
    loginService.login(phoneNumber, password, (loginSuccess, message, data) => {
      if (loginSuccess) {
        statusCode = 200;
        responseCode = constants.code.ok;
      } else {
        statusCode = 404;
        responseCode = constants.code.userInvalid;
      }
      responseMessage = message;
      responseData = data;
    });
  } else {
    statusCode = 404;
    responseCode = constants.code.paramInvalid;
    responseMessage = constants.message.paramInvalid;
    responseData = null;
  }

  helpers.sendResponse(res, responseData, responseMessage, responseCode, statusCode);
};

function validateLoginData(loginData) {
  if (!loginData.phoneNumber || !loginData.password) return null;
  const phoneNumber = loginData.phoneNumber.trim();
  const password = loginData.password.trim();
  if (phoneNumber.length < 7 || phoneNumber.length > 11 || password.length < 1) return null;
  if (Number.isNaN(phoneNumber)) return null;

  return {
    password,
    phoneNumber: Number(phoneNumber),
  };
}

const userService = require('../services/user-service');

exports.userDetail = (res, req) => {
  // to get user, do more something
  const reqUser = req.user;
  userService.getUserDetail(reqUser.id);
  console.log(reqUser);
};

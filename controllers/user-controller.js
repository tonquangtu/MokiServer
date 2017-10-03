const userService = require('../services/user-service');

exports.userDetail = (req, res) => {
  // to get user, do more something
  const reqUser = req.user;
  userService.getUserDetail(reqUser.id);
  console.log(reqUser);
};

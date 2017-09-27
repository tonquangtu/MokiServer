const { mongoose } = require('mongoose');

exports.initGlobalInstances = () => {
  global.mongoose = mongoose;
};

exports.jwtConfig = {
  secretOrKey: process.env.JWT_SECRET,
  jwtSession: {
    session: false,
  },
};

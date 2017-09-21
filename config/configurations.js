const { mongoose } = require('mongoose');

exports.initGlobalInstances = () => {
  global.mongoose = mongoose;
};


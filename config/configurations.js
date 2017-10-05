const mongoose = require('mongoose');
const constants = require('../constants/constants');
const helpers = require('../helpers/helpers');
const auth = require('../securities/authentication');
const jwtConfig = require('./jwt-config');


exports.initGlobalInstances = () => {
  global.mongoose = mongoose;
  global.jwtConfig = jwtConfig;
  global.constants = constants;
  global.helpers = helpers;
  global.auth = auth;
};


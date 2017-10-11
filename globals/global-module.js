const express = require('express');
const mongoose = require('mongoose');
const constants = require('../constants/constants');
const helpers = require('../helpers/helpers');
const auth = require('../securities/authentication');
const jwtConfig = require('../config/jwt-config');
const _ = require('lodash');

exports.initGlobalModules = () => {
  global.express = express;
  global.mongoose = mongoose;
  mongoose.Promise = global.Promise;
  global.jwtConfig = jwtConfig;
  global.constants = constants;
  global.helpers = helpers;
  global.auth = auth;
  global._ = _;
};


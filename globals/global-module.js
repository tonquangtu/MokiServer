const express = require('express');
const mongoose = require('mongoose');
const constants = require('../constants/constants');
const helpers = require('../helpers/helpers');
const auth = require('../securities/authentication');
const jwtConfig = require('../config/jwt-config');

exports.initGlobalModules = () => {
  global.express = express;
  global.mongoose = mongoose;
  global.jwtConfig = jwtConfig;
  global.constants = constants;
  global.helpers = helpers;
  global.auth = auth;
};


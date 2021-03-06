const passport = require('passport');
const passportJWT = require('passport-jwt');
const passportLocal = require('passport-local');
const constants = require('../constants/constants');
const helpers = require('../helpers/helpers');
const logger = require('../helpers/logger');
const jwtConfig = require('../config/jwt-config');

const { ExtractJwt } = passportJWT;
const JwtStrategy = passportJWT.Strategy;
const LocalStrategy = passportLocal.Strategy;

exports.setupTokenBaseAuth = () => {
  const options = {
    secretOrKey: jwtConfig.secretOrKey,
    jwtFromRequest: ExtractJwt.fromBodyField(constants.tokenField),
  };
  const strategy = new JwtStrategy(options, (payload, done) => {
    const { isLogin, user, expiredAt } = payload;
    if (isLogin && user && helpers.isValidExpiredDate(expiredAt)) {
      return done(null, user);
    }
    return done(null, false, constants.response.tokenInvalid);
  });

  passport.use(strategy);
};

exports.setupLocalAuth = () => {
  const options = {
    usernameField: 'phoneNumber',
    passwordField: 'password',
    session: false,
    passReqToCallback: true,
  };
  const strategy = new LocalStrategy(options, (req, phoneNumber, password, done) => {
    // check login
    // return user after authenticate success
  });
  passport.use(strategy);
};


exports.passportInitialize = () => passport.initialize();

exports.jwtAuthenticate = () => passport.authenticate('jwt', {
  session: jwtConfig.jwtSession.session,
});

exports.localAuthenticate = () => passport.authenticate('local');

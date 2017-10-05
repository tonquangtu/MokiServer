const passport = require('passport');
const passportJWT = require('passport-jwt');
const constants = require('../constants/constants');
const jwtConfig = require('../config/jwt-config');

const { ExtractJwt, Strategy } = passportJWT;

const options = {
  secretOrKey: jwtConfig.secretOrKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

exports.setupAuthCallback = () => {
  const strategy = new Strategy(options, (payload, done) => {
    const { isLogin, user } = payload;
    if (isLogin && user) {
      return done(null, user);
    }
    return done(new Error(constants.response.userNotFound.message), null);
  });

  passport.use(strategy);
};

exports.passportInitialize = () => passport.initialize();

exports.authenticate = () => passport.authenticate('jwt', jwtConfig.jwtSession);

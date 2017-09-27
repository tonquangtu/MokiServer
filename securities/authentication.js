const passport = require('passport');
const passportJWT = require('passport-jwt');
const { jwtConfig } = require('../config/configurations');

const { constants } = global.constants;

const { ExtractJwt } = passport.ExtractJwt;
const { Strategy } = passportJWT.Strategy;

const options = {
  secretOrKey: jwtConfig.secretOrKey,
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
};

module.exports = () => {
  const strategy = new Strategy(options, (payload, done) => {
    const { user } = payload.user;
    if (!user) {
      return done(new Error(constants.message.notFoundUser), false);
    }

    return done(null, user);
  });

  passport.use(strategy);

  return {
    initialize() {
      return passport.initialize();
    },

    authenticate() {
      return passport.authenticate('jwt', jwtConfig.jwtSession);
    },
  };
};

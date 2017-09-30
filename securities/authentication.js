const passport = require('passport');
const passportJWT = require('passport-jwt');

const { constants } = global.constants;
const { jwtConfig } = global.jwtConfig;

const { ExtractJwt } = passport.ExtractJwt;
const { Strategy } = passportJWT.Strategy;

const options = {
  secretOrKey: jwtConfig.secretOrKey,
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
};

exports.setupAuthCallback = () => {
  const strategy = new Strategy(options, (payload, done) => {
    const { isLogin, user } = payload;
    if (isLogin && user) {
      return done(null, user);
    }
    return done(new Error(constants.message.notFoundUser), null);
  });

  passport.use(strategy);
};

exports.passportInitialize = () => passport.initialize();

exports.authenticate = () => passport.authenticate('jwt', jwtConfig.jwtSession);

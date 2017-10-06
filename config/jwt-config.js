const dotEnv = require('dotenv');

dotEnv.config();
module.exports = {
  secretOrKey: process.env.JWT_SECRET,
  jwtSession: {
    session: false,
  },
};

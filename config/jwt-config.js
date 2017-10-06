const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  secretOrKey: process.env.JWT_SECRET,
  jwtSession: {
    session: false,
  },
};

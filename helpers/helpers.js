const jwt = require('jwt-simple');

const { jwtConfig } = global;

exports.connectDb = () => {
  global.mongoose.connect(process.env.DB_URL, {
    useMongoClient: true,
  });
  const db = global.mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error'));
};

exports.sendResponse = (res, data, message, responseCode, statusCode) => {
  res.status(statusCode).json({
    message,
    data,
    code: responseCode,
  });
};

exports.encodeToken = payload => jwt.encode(payload, jwtConfig.secretOrKey);

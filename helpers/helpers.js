
exports.connectDb = () => {
  global.mongoose.connect(process.env.DB_URL, {
    useMongoClient: true,
  });
  const db = global.mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error'));
};


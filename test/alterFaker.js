const dotEnv = require('dotenv');
const config = require('../config/configurations');

dotEnv.config();
config.initGlobalInstances();
const { mongoose } = global;

const dbUrl = process.env.DB_URL;
const conn = mongoose.connect(dbUrl);
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.on('open', () => {
});
const { helpers } = global;

const User = require('../models/user');

changeAllToken();
setTimeout(() => { addAttributeUser(0); }, 0);
setTimeout(() => { addAttributeUser(1); }, 5000);
setTimeout(() => { addAttributeUser(2); }, 10000);
function changeAllToken() {
  User.find({}, (err, users) => {
    if (err) {
      console.log(err.message);
    } else {
      users.forEach((user) => {
        user.token = helpers.encodeToken({
          isLogin: true,
          user: {
            id: user.id,
            username: user.username,
            phoneNumber: user.phone_number,
            role: user.role,
            url: user.url,
          },
        });
        user.save((error) => {
          if (error) {
            console.log(error);
          }
        });
      });
    }
  });
}
function addAttributeUser(type) {
  User.find({}, (err, users) => {
    if (err) {
      console.log(`One: ${err.message}`);
    } else {
      const userIdList = [];
      users.forEach((user) => {
        userIdList.push(user.id);
      });

      users.forEach((user) => {
        const userList = [];
        for (let i = 0; i < randomInt(0, 5); i += 1) {
          const choose = userIdList[randomInt(0, userIdList.length - 1)];
          if (choose !== user.id) {
            userList.push({
              user: choose,
            });
          }
        }
        if (type === 0) {
          user.follows_from = userList;
        } else if (type === 1) {
          user.follows_to = userList;
        } else {
          user.blocks = userList;
        }
        user.save((error) => {
          if (error) {
            console.log(`Two: ${error.message}`);
          } else {
            console.log ('done');
          }
        });
      });
    }
  });
}
function randomInt(low, high) {
  return Math.round(Math.random() * (high - low) + low);
}

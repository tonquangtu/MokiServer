const async = require('async');
const faker = require('faker');
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

const User = require('../models/user');
const Product = require('../models/product');
const Like = require('../models/like');
const Block = require('../models/block');
const Campaign = require('../models/campaign');
const Brand = require('../models/brand');
const Category = require('../models/category');
const Country = require('../models/country');
const Report = require('../models/report');
const Size = require('../models/size');



const users = [];
const products = [];
const likes = [];
const blocks = [];
const campaigns = [];
const brands = [];
const categories = [];
const country = [];
const reports = [];
const sizes = [];
const maxUser = 10;

function userCreate(userParams, callback) {
  const userDetail = {
    username: userParams[0],
    hash_password: userParams[1],
    phone_number: userParams[2],
    uuid: userParams[3],
    token: userParams[4],
    avatar: userParams[5],
    role: userParams[6],
    active: userParams[7],
    url: userParams[8],
    status: userParams[9],
    address: userParams[10],
    city: userParams[11],
    blocks: [],
    follows_to: [],
    follows_from: [],
    // blocks: [
    //   {
    //     user: userParams[12],
    //   },
    // ],
    // follows_to: [
    //   {
    //     user: userParams[13],
    //   },
    // ],
    // follows_from: [
    //   {
    //     user: userParams[14],
    //   },
    // ],
  };

  const user = new User(userDetail);
  user.save((err) => {
    if (err) {
      console.log(`User create error ${err.message}`);
    } else {
      users.push(user);
      callback(null, 'userCreate');
    }
  });
}
function usersFaker(cb) {
  console.log('vao user');
  async.parallel([
    function (callback) {
      const username = faker.name.findName();
      const password = faker.name.firstName();
      const phoneNumber = faker.phone.phoneNumber();
      const uuid = faker.random.uuid();
      const avatar = faker.image.avatar();
      const role = 1;
      const active = 1;
      const url = faker.internet.url();
      const status = 1;
      const address = faker.address.streetName();
      const city = faker.address.city();
      // const blocksUser = 1;
      // const followsTo = 1;
      // const followsFrom = 1;
      // const token = helpers.encodeToken({
      //   isLogin: true,
      //   user: {
      //     id: user.id,
      //     username,
      //     phoneNumber,
      //     role,
      //     url,
      //   },
      // });
      const token = password;
      const userParams = [
        username,
        password,
        phoneNumber,
        uuid,
        token,
        avatar,
        role,
        active,
        url,
        status,
        address,
        city,
        // blocksUser,
        // followsTo,
        // followsFrom,
      ];

      userCreate(userParams, callback);
    },
  ], cb);
}
function deleteAllUser(cb) {
  User.remove({}, (err) => {
    if (err) {
      console.log('can not delete user');
    } else {
      console.log('delete all user');
    }
    cb(null, 'deleteAllUser');
  });
}

function deleteAllDocuments(cb) {
  async.series(
    [
      deleteAllUser,
    ],

    (err, result) => {
      if (err) {
        console.log('can not delete all document');
      } else {
        console.log('delete all table');
      }
      cb(null, 'deleteAllDocuments');
    },
  );
}

const arrCalls = [];

for (let i = 0; i < maxUser; i += 1) {
  arrCalls.push(usersFaker);
}

async.series(
  arrCalls,

  // final callback
  (err, results) => {
    if (err) {
      console.log(`Final err at series: ${err}`);
    } else {
      console.log('Successful fake data');
    }
    // All done, disconnect from database
    mongoose.connection.close();
  },
);

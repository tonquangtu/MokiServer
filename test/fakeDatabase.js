const async = require('async');
const faker = require('faker');
const dotEnv = require('dotenv');
// const config = require('../config/configurations');
const globalModule = require('../globals/global-module');
// const constants = require('../constants/constants');

dotEnv.config();
globalModule.initGlobalModules();
const { mongoose, helpers, constants } = global;

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
const UserOrderAddress = require('../models/user-order-address');
const UserSetting = require('../models/user-setting');
const Conversation = require('../models/conversation');
const Message = require('../models/message');


const users = [];
const products = [];
const likes = [];
const blocks = [];
const campaigns = [];
const brands = [];
const categories = [];
const countries = [];
const reports = [];
const sizes = [];
const conversations = [];
const messages = [];

const maxUser = 100;
const maxProduct = 10000;
const maxLike = 1000;
const maxBlock = 100;
const maxCampaign = 100;
const maxBrand = 100;
const maxCategory = 50;
const maxReport = 100;
const maxSize = 10;
const maxCountry = 60;
const maxUserSetting = 20;
const maxOrderAddress = 30;
const maxConversation = 3;
const maxMessage = 3;

let countCons = 0;
let countMsg = 0;

deleteAllDocuments(() => {
  console.log('done');
});

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
      console.log(user.id);
      callback(null, 'userCreate');
    }
  });
}
function productCreate(productParams, callback) {
  const productDetail = {
    name: productParams[0],
    media: {
      type: productParams[1],
      urls: productParams[2],
      thumb: productParams[3],
    },
    seller: productParams[4],
    price: productParams[5],
    price_percent: productParams[6],
    description: productParams[7],
    ships_from: productParams[8],
    ships_from_ids: productParams[9],
    condition: productParams[10],
    sizes: productParams[11],
    brands: productParams[12],
    categories: productParams[13],
    url: productParams[14],
    weight: productParams[15],
    dimension: {
      height: productParams[16],
      width: productParams[17],
      length: productParams[18],
    },
    comments: [
      {
        content: productParams[19],
        commenter: productParams[20],
      },
    ],
    campaigns: productParams[21],
  };
  const product = new Product(productDetail);
  product.save((err) => {
    if (err) {
      console.log(`Product create error ${err.message}`);
    } else {
      products.push(product);
      callback(null, 'productCreate');
    }
  });
}
function likeCreate(likePrams, callback) {
  const likeDetail = {
    user: likePrams[0],
    product: likePrams[1],
    is_liked: likePrams[2],
  };

  const like = new Like(likeDetail);
  like.save((err) => {
    if (err) {
      console.log(err);
    } else {
      likes.push(like);
      callback(null, 'likeCreate');
    }
  });
}
function blockCreate(blockParams, callback) {
  const blockDetail = {
    user: blockParams[0],
    product: blockParams[1],
    is_blocked: blockParams[2],
  };

  const block = new Block(blockDetail);
  block.save((err) => {
    if (err) {
      console.log(err);
    } else {
      blocks.push(block);
      callback(null, 'blockCreate');
    }
  });
}
function campaignCreate(campaignParams, callback) {
  const campaignDetail = {
    name: campaignParams[0],
    banner: campaignParams[1],
  };

  const campaign = new Campaign(campaignDetail);
  campaign.save((err) => {
    if (err) {
      console.log(err);
    } else {
      campaigns.push(campaign);
      callback(null, 'campaignCreate');
    }
  });
}
function brandCreate(brandParams, callback) {
  const brandDetail = {
    name: brandParams[0],
  };

  const brand = new Brand(brandDetail);
  brand.save((err) => {
    if (err) {
      console.log(err);
    } else {
      brands.push(brand);
      callback(null, 'brandCreate');
    }
  });
}
function categoryCreate(categoryParams, callback) {
  const categoryDetail = {
    name: categoryParams[0],
    has_brand: categoryParams[1],
    has_name: categoryParams[2],
    parent: categoryParams[3],
    has_child: categoryParams[4],
    has_size: categoryParams[5],
  };

  const category = new Category(categoryDetail);
  category.save((err) => {
    if (err) {
      console.log(err);
    } else {
      categories.push(category);
      callback(null, 'categoryCreate');
    }
  });
}
function reportCreate(reportParams, callback) {
  const reportDetail = {
    reporter: reportParams[0],
    product: reportParams[1],
    subject: reportParams[2],
    details: reportParams[3],
  };

  const report = new Report(reportDetail);
  report.save((err) => {
    if (err) {
      console.log(err);
    } else {
      reports.push(report);
      callback(null, 'reportCreate');
    }
  });
}
function sizeCreate(sizeParams, callback) {
  const sizeDetail = {
    name: sizeParams[0],
  };

  const size = new Size(sizeDetail);
  size.save((err) => {
    if (err) {
      console.log(err);
    } else {
      sizes.push(size);
      callback(null, 'sizeCreate');
    }
  });
}
function countryCreate(countryParams, callback) {
  const countryDetail = {
    provinces: [
      {
        order: countryParams[0],
        name: countryParams[1],
        districts: [
          {
            order: countryParams[2],
            name: countryParams[3],
            towns: [
              {
                order: countryParams[4],
                name: countryParams[5],
              },
            ],
          },
        ],
      },
    ],
  };

  const country = new Country(countryDetail);
  country.save((err) => {
    if (err) {
      console.log(err);
    } else {
      countries.push(country);
      callback(null, 'countryCreate');
    }
  });
}
function userSettingCreate(userSettingParams, callback) {
  const userSettingDetail = {
    user: userSettingParams[0],
    push_setting: {
      like: userSettingParams[1],
      comment: userSettingParams[2],
      announcement: userSettingParams[3],
      sound_on: userSettingParams[4],
      sound_default: userSettingParams[5],
    },
  };

  const userSetting = new UserSetting(userSettingDetail);
  userSetting.save((err) => {
    if (err) {
      console.log(err.message);
    } else {
    }
    callback(null, 'userSettingCreate');
  });
}
function userOrderAddressCreate(orderParams, callback) {
  const orderDetail = {
    user: orderParams[0],
    order_address: {
      address: orderParams[1],
      addresses_id: orderParams[2],
      default: orderParams[3],
    },
  };

  const order = new UserOrderAddress(orderDetail);
  order.save((err) => {
    if (err) {
      console.log(err.message);
    } else {
    }
    callback(null, 'userOrder');
  });
}





function usersFaker(cb) {
  console.log('vao user');
  const pass = '123456789';
  async.parallel([
    function (callback) {
      const username = faker.name.findName();
      const hashPassword = helpers.generateHashPassword(pass);
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
      const token = hashPassword;
      const userParams = [
        username,
        hashPassword,
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
function productsFaker(cb) {
  console.log('product faker');
  async.parallel([
    function (callback) {
      const name = faker.name.findName();
      const mediaType = 0;
      const mediaUrlArr = faker.image.imageUrl();
      const mediaThumb = '';
      const seller = users[randomInt(0, users.length - 1)];
      const price = faker.random.number();
      const pricePercent = 0;
      const description = faker.lorem.paragraph();
      const shipsFrom = 'No thing';
      const shipsFromIds = [];
      const condition = 0;
      const sizeArr = [];
      const brandArr = [];
      const categoryArr = [];
      const url = faker.internet.url();
      const weight = faker.random.number();
      const dimensionHeight = faker.random.number();
      const dimensionWidth = faker.random.number();
      const dimensionLength = faker.random.number();
      const commentsContent = faker.lorem.sentence();
      const commenter = users[randomInt(0, users.length - 1)];
      const campaignArr = [];
      const productParams = [
        name,
        mediaType,
        mediaUrlArr,
        mediaThumb,
        seller,
        price,
        pricePercent,
        description,
        shipsFrom,
        shipsFromIds,
        condition,
        sizeArr,
        brandArr,
        categoryArr,
        url,
        weight,
        dimensionHeight,
        dimensionWidth,
        dimensionLength,
        commentsContent,
        commenter,
        campaignArr,
      ];

      productCreate(productParams, callback);
    },
  ], cb);
}
function likesFaker(cb) {
  console.log('like faker');
  async.parallel([
    function (callback) {
      const user = users[randomInt(0, users.length - 1)];
      const product = products[randomInt(0, products.length - 1)];
      const isLiked = randomInt(0, 1);
      const likeParams = [
        user,
        product,
        isLiked,
      ];
      likeCreate(likeParams, callback);
    },
  ], cb);
}
function blocksFaker(cb) {
  console.log('block faker');
  async.parallel([
    function (callback) {
      const user = users[randomInt(0, users.length - 1)];
      const product = products[randomInt(0, products.length - 1)];
      const isBlocked = randomInt(0, 1);
      const blockParams = [
        user,
        product,
        isBlocked,
      ];
      blockCreate(blockParams, callback);
    },
  ], cb);
}
function campaignsFaker(cb) {
  console.log('campaign faker');
  async.parallel([
    function (callback) {
      const name = faker.name.title();
      const banner = faker.image.imageUrl();
      const campaignParams = [
        name,
        banner,
      ];
      campaignCreate(campaignParams, callback);
    },
  ], cb);
}
function brandsFaker(cb) {
  console.log('brand faker');
  async.parallel([
    function (callback) {
      const name = faker.name.title();
      const brandParams = [
        name,
      ];
      brandCreate(brandParams, callback);
    },
  ], cb);
}
function categoriesFaker(cb) {
  console.log('category faker');
  async.parallel([
    function (callback) {
      const name = faker.name.title();
      const hasBrand = 0;
      const hasName = 1;
      const parent = '';
      const hasChild = 0;
      const hasSize = 0;
      const categoryParams = [
        name,
        hasBrand,
        hasName,
        parent,
        hasChild,
        hasSize,
      ];
      categoryCreate(categoryParams, callback);
    },
  ], cb);
}
function reportsFaker(cb) {
  console.log('report faker');
  async.parallel([
    function (callback) {
      const reporter = users[randomInt(0, users.length - 1)];
      const product = products[randomInt(0, products.length - 1)];
      const subject = faker.name.title();
      const details = faker.lorem.paragraph();
      const reportParams = [
        reporter,
        product,
        subject,
        details,
      ];
      reportCreate(reportParams, callback);
    },
  ], cb);
}
function sizesFaker(cb) {
  console.log('size faker');
  async.parallel([
    function (callback) {
      const name = faker.lorem.word();
      const sizeParams = [
        name,
      ];
      sizeCreate(sizeParams, callback);
    },
  ], cb);
}
function countriesFaker(cb) {
  console.log('country faker');
  async.parallel([
    function (callback) {
      const provinceOrder = faker.random.number();
      const provinceName = faker.address.city();
      const districtOrder = faker.random.number();
      const districtName = faker.address.state();
      const townOrder = faker.random.number();
      const townName = faker.address.streetName();
      const countryParams = [
        provinceOrder,
        provinceName,
        districtOrder,
        districtName,
        townOrder,
        townName,
      ];
      countryCreate(countryParams, callback);
    },
  ], cb);
}
function userSettingFaker(cb) {
  async.parallel([
    function (callback) {
      const userSettingParams = [
        users[randomInt(0, users.length - 1)],
        randomInt(0, 1),
        randomInt(0, 1),
        randomInt(0, 1),
        randomInt(0, 1),
        randomInt(0, 1),
      ];

      userSettingCreate(userSettingParams, callback);
    },
  ], cb);
}
function userOrderAddressFaker(cb) {
  async.parallel([
    function (callback) {
      const orderParams = [
        users[randomInt(0, users.length - 1)],
        faker.address.streetName(),
        [
          randomInt(10, 99),
          randomInt(100, 999),
          randomInt(1000, 9999),
        ],
        faker.address.streetName(),
      ];

      userOrderAddressCreate(orderParams, callback);
    },
  ], cb);
}

function conversationCreate(consParams, callback) {
  const consDetail = {
    user: consParams[0],
    partner: consParams[1],
    product: consParams[2],
    partner_role: consParams[3],
    last_message: {
      message: consParams[4],
      unread: consParams[5],
      created_at: consParams[6],
    },
    num_unread_message: consParams[7],
    deleted_at: null,
  };
  const cons = new Conversation(consDetail);
  cons.save((err, conversation) => {
    if (err) {
      console.log(err.message);
    } else {
      conversations.push(conversation);
      callback(null, 'conversationCreate');
    }
  });
}

function conversationFaker(cb) {
  console.log('conversation faker');
  async.parallel([
    function (callback) {
      const now = new Date();
      const fakeMsg = faker.lorem.words();
      const numUnread = 1;

      const consParams = [
        users[10],
        products[countCons].seller,
        products[countCons],
        constants.conversation.partnerRole.seller,
        fakeMsg,
        constants.conversation.status.unread,
        now,
        numUnread,
        now,
      ];

      conversationCreate(consParams, callback);
      countCons += 1;
    },
  ], cb);
}

function messageCreate(msgParams, callback) {
  const { conversation, contents } = msgParams;
  const msgList = contents.map((item) => {
    return {
      message: item.message,
      sender_type: item.senderType,
      unread: item.unread,
      deleted_at: null,
    };
  });

  const msgDetail = {
    conversation,
    contents: msgList,
  };

  const msg = new Message(msgDetail);
  msg.save((err, addedMsg) => {
    if (err) {
      console.log(err.message);
    } else {
      messages.push(addedMsg);
      callback(null, 'messageCreate');
    }
  });
}

function messageFaker(cb) {
  console.log('message faker');
  async.parallel([

    function (callback) {
      const now = new Date();
      const contents = [];
      for (let i = 0; i < 10; i++) {
        contents.push({
          message: faker.lorem.words(),
          senderType: constants.conversation.sender.user,
          unread: constants.conversation.status.read,
          createdAt: now,
        });
      }

      const msgParams = {
        conversation: conversations[countMsg],
        contents,
      };

      countMsg += 1;
      messageCreate(msgParams, callback);
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
function deleteAllProduct(cb) {
  Product.remove({}, (err) => {
    if (err) {
      console.log('can not delete product');
    } else {
      console.log('delete all product');
    }
    cb(null, 'deleteAllProduct');
  });
}
function deleteAllLike(cb) {
  Like.remove({}, (err) => {
    if (err) {
      console.log('can not delete like');
    } else {
      console.log('delete all like');
    }
    cb(null, 'deleteAllLike');
  });
}
function deleteAllBlock(cb) {
  Block.remove({}, (err) => {
    if (err) {
      console.log('can not delete block');
    } else {
      console.log('delete all block');
    }
    cb(null, 'deleteAllBlock');
  });
}
function deleteAllCampaign(cb) {
  Campaign.remove({}, (err) => {
    if (err) {
      console.log('can not delete campaign');
    } else {
      console.log('delete all campaign');
    }
    cb(null, 'deleteAllCampaign');
  });
}
function deleteAllBrand(cb) {
  Brand.remove({}, (err) => {
    if (err) {
      console.log('can not delete brand');
    } else {
      console.log('delete all brand');
    }
    cb(null, 'deleteAllBrand');
  });
}
function deleteAllCategory(cb) {
  Category.remove({}, (err) => {
    if (err) {
      console.log('can not delete category');
    } else {
      console.log('delete all category');
    }
    cb(null, 'deleteAllCategory');
  });
}
function deleteAllReport(cb) {
  Report.remove({}, (err) => {
    if (err) {
      console.log('can not delete report');
    } else {
      console.log('delete all report');
    }
    cb(null, 'deleteAllReport');
  });
}
function deleteAllSize(cb) {
  Size.remove({}, (err) => {
    if (err) {
      console.log('can not delete size');
    } else {
      console.log('delete all size');
    }
    cb(null, 'deleteAllSize');
  });
}
function deleteAllCountry(cb) {
  Country.remove({}, (err) => {
    if (err) {
      console.log('can not delete country');
    } else {
      console.log('delete all country');
    }
    cb(null, 'deleteAllCountry');
  });
}
function deleteAllUserSetting(cb) {
  UserSetting.remove({}, (err) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log('delete all user setting');
    }
    cb(null, 'deleteAllUserSetting');
  });
}
function deleteAllOrderAddress(cb) {
  UserOrderAddress.remove({}, (err) => {
    if (err) {
      console.log('can not delete order address');
    } else {
      console.log('delete all order address');
    }
    cb(null, 'deleteAllOrderAddress');
  });
}

function deleteAllCons(cb) {
  Conversation.remove({}, (err) => {
    if (err) {
      console.log('can not delete conversation');
    } else {
      console.log('delete all conversation');
    }
    cb(null, 'deleteAllCons');
  });
}

function deleteAllMsg(cb) {
  Message.remove({}, (err) => {
    if (err) {
      console.log('can not delete messages');
    } else {
      console.log('delete all messages');
    }
    cb(null, 'deleteAllMsg');
  });
}

function deleteAllDocuments(cb) {
  async.series(
    [
      deleteAllBlock,
      deleteAllLike,
      deleteAllProduct,
      deleteAllUserSetting,
      deleteAllOrderAddress,
      deleteAllUser,
      deleteAllCampaign,
      deleteAllBrand,
      deleteAllCategory,
      deleteAllReport,
      deleteAllSize,
      deleteAllCountry,
      deleteAllCons,
      deleteAllMsg,
    ],
    (err, result) => {
      if (err) {
        console.log('can not delete all document');
      } else {
        console.log('delete all table');
      }
      cb(null, 'deleteAllDocuments');
    });
}

const arrCalls = [];

for (let i = 0; i < maxUser; i += 1) {
  arrCalls.push(usersFaker);
}
for (let i = 0; i < maxProduct; i += 1) {
  arrCalls.push(productsFaker);
}
for (let i = 0; i < maxLike; i += 1) {
  arrCalls.push(likesFaker);
}
for (let i = 0; i < maxBlock; i += 1) {
  arrCalls.push(blocksFaker);
}
for (let i = 0; i < maxCampaign; i += 1) {
  arrCalls.push(campaignsFaker);
}
for (let i = 0; i < maxBrand; i += 1) {
  arrCalls.push(brandsFaker);
}
for (let i = 0; i < maxCategory; i += 1) {
  arrCalls.push(categoriesFaker);
}
for (let i = 0; i < maxReport; i += 1) {
  arrCalls.push(reportsFaker);
}
for (let i = 0; i < maxSize; i += 1) {
  arrCalls.push(sizesFaker);
}
for (let i = 0; i < maxCountry; i += 1) {
  arrCalls.push(countriesFaker);
}
for (let i = 0; i < maxUserSetting; i += 1) {
  arrCalls.push(userSettingFaker);
}
for (let i = 0; i < maxOrderAddress; i += 1) {
  arrCalls.push(userOrderAddressFaker);
}

for (let i = 0; i < maxConversation; i++) {
  arrCalls.push(conversationFaker);
}

for (let i = 0; i < maxMessage; i++) {
  arrCalls.push(messageFaker);
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
  });

function randomInt(low, high) {
  return Math.round(Math.random() * (high - low) + low);
}

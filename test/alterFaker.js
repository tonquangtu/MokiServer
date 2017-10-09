const dotEnv = require('dotenv');
const config = require('../config/configurations');
const globalModule = require('../globals/global-module');

dotEnv.config();
globalModule.initGlobalModules();
const { mongoose } = global;

const dbUrl = process.env.DB_URL;
const conn = mongoose.connect(dbUrl);
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.on('open', () => {
});
const { helpers } = global;

const User = require('../models/user');
const Product = require('../models/product');
const Size = require('../models/size');
const Category = require('../models/category');
const Brand = require('../models/brand');

// changeAllToken();
addAttributeProduct();
// setTimeout(() => { addAttributeUser(0); }, 0);
// setTimeout(() => { addAttributeUser(1); }, 5000);
// setTimeout(() => { addAttributeUser(2); }, 10000);
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
            console.log('done');
          }
        });
      });
    }
  });
}
function addAttributeProduct() {
  const sizeList = Size.find({}).exec().then((sizes) => {
    if (!sizes || sizes.length === 0) {
      console.log('No size');
    } else {
      return sizes.map(size => size.id);
    }
  });
  const categoryList = Category.find({}).exec().then((categories) => {
    if (!categories || categories.length === 0) {
      console.log('No category');
    } else {
      return categories.map(cateogry => cateogry.id);
    }
  });
  const brandList = Brand.find({}).exec().then((brands) => {
    if (!brands || brands.length === 0) {
      console.log('No brand');
    } else {
      return brands.map(brand => brand.id);
    }
  });
  Promise.all([
    sizeList, categoryList, brandList,
  ]).then((data) => {
    Product.find({}).exec().then((products) => {
      if (!products || products.length === 0) {
        console.log('No product');
      } else {
        let count = 0;
        products.forEach((product) => {
          product.sizes = getRamdomArr(data[0], randomInt(0, 2));
          product.categories = getRamdomArr(data[1], randomInt(1, 2));
          product.brands = getRamdomArr(data[2], randomInt(1, 2));
          product.save((err) => {
            count += 1;
            if (err) {
              console.log(err.message);
            }
            if (count === products.length) {
              console.log('Done add property for product');
            }
          });
        });
      }
    }).catch((err) => {
      console.log(err.message);
    });
  });
}
function randomInt(low, high) {
  return Math.round(Math.random() * (high - low) + low);
}
function getRamdomArr(arr, length) {
  const arrNew = [];
  for (let i = 0; i < length; i += 1) {
    arrNew.push(arr[randomInt(0, arr.length - 1)]);
  }
  return arrNew;
}

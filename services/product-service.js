const UserRepo = require('../responsitories/user-responsitory');
const ProductRepo = require('../responsitories/product-responsitory');
const LikeRepo = require('../responsitories/like-responsitory');
const BlockRepo = require('../responsitories/block-responsitory');

const { constants } = global;

exports.getProductList = (categoryId, campaignId, lastId, count, index, userId, callback) => {
  console.log(`${categoryId} ${campaignId} ${lastId} ${count} ${index} ${userId} `);
  let response = {};
  const promise = ProductRepo.getListProducts(categoryId, campaignId, lastId, count);
  promise.then((products) => {
    if (!products || products.length === 0) {
      response = {
        code: constants.response.noDataOrEndListData.code,
        message: constants.response.noDataOrEndListData.message,
        data: null,
      };
      return callback(response);
    }

    ProductRepo.getNewItems(index).then((data) => {
      const numNewItems = data.length;
      getProductAtributes(products, userId, (productArr) => {
        response = {
          code: constants.response.ok.code,
          message: constants.response.ok.message,
          data: {
            products: productArr,
            new_items: numNewItems,
            last_id: products.slice(-1)[0].id,
          },
        };
        return callback(response);
      });

    });
  }).catch((err) => {
    response = {
      code: constants.response.systemError.code,
      message: constants.response.systemError.message,
      data: null,
    };
    return callback(response);
  });
};

function getProductAtributes(products, userId, cb) {
  const productArr = [];
  let count = 0;
  products.forEach((product) => {
    const isLiked = LikeRepo.getLikeUserProduct(userId, product.id)
      .then((data) => {
        if (!data) {
          return false;
        }
        return data.length !== 0;
      }).catch((err) => {

      });
    const isBlocked = BlockRepo.getBlockUserProduct(userId, product.id)
      .then((data) => {
        if (!data) {
          return false;
        }
        return data.length !== 0;
      }).catch((err) => {

      });
    Promise.all([
      isLiked, isBlocked,
    ]).then((data) => {
      let canEdit = false;

      const seller = UserRepo.getUserById(product.seller);
      if (seller.id === userId || (!data[1] && product.banned === 0)) {
        if (seller.id === userId) {
          canEdit = true;
        }
        const oneProduct = {
          id: product.id,
          name: product.name,
          image: [],
          video: [],
          price: product.price,
          price_percent: product.price_percent,
          brand: product.brands,
          described: product.description,
          created: product.created_at,
          like: product.like,
          comment: product.comment,
          is_liked: data[0],
          is_blocked: data[1],
          can_edit: canEdit,
          banned: product.banned,
          seller: {
            id: seller.id,
            username: seller.name,
            avatar: seller.avatar,
          },
        };
        if (product.media.type === constants.product.media.type.image) {
          product.media.urls.forEach((item) => {
            oneProduct.image.push({
              url: item,
            });
          });
        } else {
          product.media.urls.forEach((item) => {
            oneProduct.video.push({
              url: item[0],
              thumb: product.media.thumb,
            });
          });
        }
        productArr.push(oneProduct);
      }
      count += 1;
      if (count === products.length) {
        return cb(productArr);
      }
    }).catch((err) => {
      count += 1;
      console.log(err);
    });
  });
}

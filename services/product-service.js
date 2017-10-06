const UserRepo = require('../repositories/user-repository');
const ProductRepo = require('../repositories/product-repository');
const LikeRepo = require('../repositories/like-repository');
const BlockRepo = require('../repositories/block-repository');

const { constants } = global;

exports.getListProduct = (categoryId, campaignId, lastId, count, index, userId, callback) => {
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

    const numNewItems = ProductRepo.getNewItems().then(data => data.length);
    response = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data: {
        products: getProductArr(products, userId),
        new_items: numNewItems,
        last_id: products.slice(-1)[0].id,
      },
    };
    return callback(response);
  }).catch((err) => {
    response = {
      code: constants.response.systemError.code,
      message: constants.response.systemError.message,
      data: null,
    };
    return callback(response);
  });
};

function getProductArr(products, userId) {
  const productArr = [];
  products.forEach((product) => {
    const likePromise = LikeRepo.getLikeUserProduct(userId, product.id);
    const blockPromise = BlockRepo.getBlockUserProduct(userId, product.id);
    const isLiked = likePromise.then(data => data.length !== 0);
    const isBlocked = blockPromise.then(data => data.length !== 0);
    let canEdit = false;

    const seller = UserRepo.getUserById(product.seller);

    if (product.banned === 0 || seller.id === userId) {
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
        is_liked: isLiked,
        is_blocked: isBlocked,
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
  });
  return productArr;
}

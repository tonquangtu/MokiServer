const productRepo = require('../repositories/product-repository');
const likeRepo = require('../repositories/like-repository');
const blockRepo = require('../repositories/block-repository');

const { constants } = global;

exports.getProductList = (data, callback) => {
  const {
    categoryId, campaignId, lastId, count, index, userId,
  } = data;

  let response = {};
  let products = [];

  const promise = productRepo.getProductList(categoryId, campaignId, lastId, count);
  promise.then((productList) => {
    products = productList;

    if (!products || products.length === 0) {
      return callback(constants.response.noDataOrEndListData);
    }

    return productRepo.getNewItems(index);
  }).then((dataResponse) => {
    const numNewItems = dataResponse.length;

    getProductAttributes(products, userId, (productArr) => {
      response = {
        code: constants.response.ok.code,
        message: constants.response.ok.message,
        data: {
          products: productArr,
          newItems: numNewItems,
          lastId: products.slice(-1)[0].id,
        },
      };

      return callback(response);
    });
  }).catch(err => callback(constants.response.systemError));
};

exports.getProductDetail = (productId, userId, callback) => {
  const promise = productRepo.getProductDetail(productId);

  promise.then((product) => {
    if (!product) {
      return callback(constants.response.productNotExist);
    }

    getResponseForProductDetail(product, userId, responseData => callback(responseData));
  }).catch(err => callback(constants.response.systemError));
};

exports.getCommentProduct = (productId, callback) => {
  const promise = productRepo.getProductWithComment(productId);
  promise.then((product) => {
    if (!product) {
      return callback(constants.response.productNotExist);
    }

    const { comments } = product;

    if (comments.length === 0) {
      return callback(constants.response.noDataOrEndListData);
    }

    const commentResponse = comments.map((comment) => {
      return {
        id: comment.id,
        comment: comment.content,
        created: comment.created_at,
        poster: {
          id: comment.commenter.id,
          name: comment.commenter.username,
          avatar: comment.commenter.avatar,
        },
      };
    });

    const response = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data: commentResponse,
      isBlocked: [],
    };

    return callback(response);
  }).catch(err => callback(constants.response.systemError));
};

function getProductAttributes(products, userId, cb) {
  const productArr = [];
  let count = 0;
  products.forEach((product) => {
    let isLiked = false;
    let isBlocked = false;
    if (userId !== 0) {
      isLiked = likeRepo.getLikeUserProduct(userId, product.id);
      isBlocked = blockRepo.getBlockUserProduct(userId, product.id);
    }

    Promise.all([
      isLiked, isBlocked,
    ]).then((data) => {
      let canEdit = false;
      let isUserLiked = false;
      let isUserBlocked = false;

      if (data[0]) {
        isUserLiked = data[0].length !== 0;
      }

      if (data[1]) {
        isUserBlocked = data[1].length !== 0;
      }

      const { seller } = product;

      if (seller && (seller.id === userId || (!isUserBlocked && product.banned === 0))) {
        if (seller.id === userId) {
          canEdit = true;
        }

        const oneProduct = {
          id: product.id,
          name: product.name,
          image: [],
          video: [],
          price: product.price,
          pricePercent: product.price_percent,
          brand: getListItemOfProduct(product.brands),
          described: product.description,
          created: product.created_at,
          like: product.like,
          comment: product.comment,
          isLiked: isUserLiked,
          isBlocked: isUserBlocked,
          canEdit,
          banned: product.banned,
          seller: {
            id: seller.id,
            username: seller.username,
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

function getResponseForProductDetail(product, userId, callback) {
  let isLiked = false;
  let isBlocked = false;

  if (userId !== 0) {
    isLiked = likeRepo.getLikeUserProduct(userId, product.id);
    isBlocked = blockRepo.getBlockUserProduct(userId, product.id);
  }

  const { seller } = product;
  const numProductOfUser = productRepo.getProductOfUser(seller.id);

  Promise.all([
    isLiked,
    isBlocked,
    numProductOfUser,
  ]).then((data) => {
    let canEdit = false;
    let isUserLiked = false;
    let isUserBlocked = false;
    let listingProduct = 0;
    if (data[0]) {
      isUserLiked = data[0].length !== 0;
    }

    if (data[1]) {
      isUserBlocked = data[1].length !== 0;
    }

    if (data[2]) {
      listingProduct = data[2].length;
    }

    if (seller && (seller.id === userId || (!isUserBlocked && product.banned === 0))) {
      if (seller.id === userId) {
        canEdit = true;
      }

      const productResponse = {
        id: product.id,
        name: product.name,
        price: product.price,
        pricePercent: product.price_percent,
        described: product.description,
        shipsFrom: product.ships_from,
        shipsFromId: product.ships_from_id,
        condition: product.condition,
        created: product.created_at,
        like: product.like,
        comment: product.comment,
        isLiked: isUserLiked,
        image: [],
        video: [],
        size: getListItemOfProduct(product.sizes),
        brand: getListItemOfProduct(product.brands),
        seller: {
          id: seller.id,
          name: seller.name,
          avatar: seller.avatar,
          score: Math.round(Math.random() * 5),
          listing: listingProduct,
        },
        category: getListItemOfProduct(product.categories),
        isBlocked: isUserBlocked,
        canEdit,
        banned: product.banned,
        url: product.url,
        weight: product.weight,
        dimension: product.dimension,
      };

      if (product.media.type === constants.product.media.type.image) {
        product.media.urls.forEach((item) => {
          productResponse.image.push({
            url: item,
          });
        });
      } else {
        product.media.urls.forEach((item) => {
          productResponse.video.push({
            url: item[0],
            thumb: product.media.thumb,
          });
        });
      }

      const response = {
        code: constants.response.ok.code,
        message: constants.response.ok.message,
        data: productResponse,
      };

      callback(response);
    }
  }).catch((err) => {
    console.log(err);
    callback(constants.response.systemError);
  });
}

function getListItemOfProduct(listItem) {
  return listItem.map((item) => {
    return {
      id: item.id,
      name: item.name,
    };
  });
}

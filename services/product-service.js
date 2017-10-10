const userRepo = require('../repositories/user-repository');
const productRepo = require('../repositories/product-repository');
const likeRepo = require('../repositories/like-repository');
const blockRepo = require('../repositories/block-repository');
const sizeRepo = require('../repositories/size-repository');
const categoryRepo = require('../repositories/category-repository');
const brandRepo = require('../repositories/brand-repository');

const { constants } = global;

exports.getProductList = (data, callback) => {
  const categoryId = data.categoryId;
  const campaignId = data.campaignId;
  const lastId = data.lastId;
  const count = data.count;
  const index = data.index;
  const userId = data.userId;
  let response = {};
  const promise = productRepo.getProductList(categoryId, campaignId, lastId, count);
  promise.then((products) => {
    if (!products || products.length === 0) {
      return callback(getResponseForNoData());
    }

    productRepo.getNewItems(index).then((dataResponse) => {
      const numNewItems = dataResponse.length;
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
  }).catch(err => callback(getResponseForErrorSystem()));
};
exports.getProductDetail = (productId, userId, callback) => {
  const promise = productRepo.getProductDetail(productId);

  promise.then((product) => {
    if (!product) {
      return callback(getResponseForNoData());
    }
    getResponseForProductDetail(product, userId, responseData => callback(responseData));
  }).catch(err => callback(getResponseForErrorSystem()));
};
exports.getCommentProduct = (productId, callback) => {
  const promise = productRepo.getProductDetail(productId);
  promise.then((product) => {
    const comments = product.comments;
    if (comments.length === 0) {
      return callback(getResponseForNoData());
    }
    const promiseCommentList = [];
    comments.forEach((comment) => {
      const onePromiseComment = userRepo.getUserById(comment.commenter)
        .then((commenter) => {
          return {
            id: comment.id,
            comment: comment.content,
            created: comment.created_at,
            poster: {
              id: commenter.id,
              name: commenter.username,
              avatar: commenter.avatar,
            },
          };
        }).catch((err) => {
          console.log(err.message);
          return null;
        });
      promiseCommentList.push(onePromiseComment);
    });
    Promise.all(promiseCommentList).then((commentResponse) => {
      const response = {
        code: constants.response.ok.code,
        message: constants.response.ok.message,
        data: commentResponse,
        is_blocked: [],
      };
      callback(response);
    }).catch((err) => {
      console.log(err.message);
      callback(getResponseForErrorSystem());
    });


  }).catch(err => callback(getResponseForErrorSystem()));
};

function getProductAtributes(products, userId, cb) {
  const productArr = [];
  let count = 0;
  products.forEach((product) => {
    let isLiked = false;
    let isBlocked = false;
    if (userId !== 0) {
      isLiked = likeRepo.getLikeUserProduct(userId, product.id)
        .then((data) => {
          if (!data) {
            return false;
          }
          return data.length !== 0;
        }).catch(err => false);
      isBlocked = blockRepo.getBlockUserProduct(userId, product.id)
        .then((data) => {
          if (!data) {
            return false;
          }
          return data.length !== 0;
        }).catch(err => false);
    }

    Promise.all([
      isLiked, isBlocked, getListBrandOfProduct(product),
    ]).then((data) => {
      let canEdit = false;

      const seller = userRepo.getUserById(product.seller);
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
          brand: data[2],
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
function getResponseForNoData() {
  return {
    code: constants.response.noDataOrEndListData.code,
    message: constants.response.noDataOrEndListData.message,
    data: null,
  };
}
function getResponseForErrorSystem() {
  return {
    code: constants.response.systemError.code,
    message: constants.response.systemError.message,
    data: null,
  };
}
function getResponseForProductDetail(product, userId, callback) {
  let isLiked = false;
  let isBlocked = false;
  if (userId !== 0) {
    isLiked = likeRepo.getLikeUserProduct(userId, product.id)
      .then((data) => {
        if (!data) {
          return false;
        }
        return data.length !== 0;
      }).catch(err => false);
    isBlocked = blockRepo.getBlockUserProduct(userId, product.id)
      .then((data) => {
        if (!data) {
          return false;
        }
        return data.length !== 0;
      }).catch(err => false);
  }
  const seller = userRepo.getUserById(product.seller);
  const numProductOfUser = productRepo.getProductOfUser(seller.id)
    .then(products => products.length).catch((err) => {
      console.log(err.message);
      return 0;
    });

  Promise.all([
    isLiked,
    isBlocked,
    getListSizeOfProduct(product),
    getListCategoryOfProduct(product),
    getListBrandOfProduct(product),
    numProductOfUser,
  ]).then((data) => {
    let canEdit = false;

    if (seller.id === userId || (!data[1] && product.banned === 0)) {
      if (seller.id === userId) {
        canEdit = true;
      }

      const productResponse = {
        id: product.id,
        name: product.name,
        price: product.price,
        price_percent: product.price_percent,
        described: product.description,
        ships_from: product.ships_from,
        ships_from_id: product.ships_from_id,
        condition: product.condition,
        created: product.created_at,
        like: product.like,
        comment: product.comment,
        is_liked: data[0],
        image: [],
        video: [],
        size: data[2],
        brand: data[4],
        seller: {
          id: seller.id,
          name: seller.name,
          avatar: seller.avatar,
          score: Math.round(Math.random() * 5),
          listing: data[5],
        },
        category: data[3],
        is_blocked: data[1],
        can_edit: canEdit,
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
    callback(getResponseForErrorSystem());
  });
}
function getListSizeOfProduct(product) {
  const promiseSizeList = [];
  product.sizes.forEach((sizeId) => {
    const onePromiseSize = sizeRepo.getSizeById(sizeId).then(size => ({
      id: sizeId,
      size_name: size.name,
    }));
    promiseSizeList.push(onePromiseSize);
  });
  return Promise.all(promiseSizeList).then(data => data);
}
function getListCategoryOfProduct(product) {
  const promiseCategoryList = [];
  product.categories.forEach((categoryId) => {
    const onePromiseCategory = categoryRepo.getCategoryById(categoryId)
      .then(category => ({
        id: categoryId,
        name: category.name,
      }));
    promiseCategoryList.push(onePromiseCategory);
  });

  return Promise.all(promiseCategoryList).then(data => data);
}
function getListBrandOfProduct(product) {
  const promiseBrandList = [];
  product.brands.forEach((brandId) => {
    const onePromiseBrand = brandRepo
      .getBrandById(brandId)
      .then(brand => ({
        id: brandId,
        brand_name: brand.name,
      }));
    promiseBrandList.push(onePromiseBrand);
  });

  return Promise.all(promiseBrandList).then(data => data);
}

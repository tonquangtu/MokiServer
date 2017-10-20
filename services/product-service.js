const productRepo = require('../repositories/product-repository');
const likeRepo = require('../repositories/like-repository');
const blockRepo = require('../repositories/block-repository');
const reportRepo = require('../repositories/report-repository');

const { constants, logger, helpers } = global;

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

    return productRepo.getNewItemNum(index, categoryId);
  }).then((newItemNum) => {
    if (newItemNum) {
      getProductAttributes(products, userId, (productArr) => {
        response = {
          code: constants.response.ok.code,
          message: constants.response.ok.message,
          data: {
            products: productArr,
            newItems: newItemNum,
            lastId: products.slice(-1)[0].id,
          },
        };

        return callback(response);
      });
    }
  }).catch((err) => {
    logger.error('Error at function getProductList.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.getProductDetail = (productId, userId, callback) => {
  const promise = productRepo.getProductDetail(productId);

  promise.then((product) => {
    if (!product) {
      return callback(constants.response.productNotExist);
    }
    getResponseForProductDetail(product, userId, responseData => callback(responseData));
  }).catch((err) => {
    logger.error('Error at function getProductDetail.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.getProductCommentList = (productId, userId, callback) => {
  const promise = productRepo.getProductCommentList(productId);
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

    const isBlocked = (userId === 0) ? null : false;
    const response = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data: commentResponse,
      isBlocked,
    };

    return callback(response);
  }).catch((err) => {
    logger.error('Error at function getProductCommentList.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.addProductComment = (productId, comment, index, userId, callback) => {
  const promise = productRepo.getProductCommentList(productId);
  promise.then((product) => {
    if (!product) {
      return callback(constants.response.productNotExist);
    }

    const newProduct = product;
    const { comments } = newProduct;

    comments.push({
      content: comment,
      commenter: userId,
    });
    newProduct.comment += 1;

    return productRepo.findAndUpdateProductCommentList(product.id, newProduct, { new: true });
  }).then((newProduct) => {
    if (newProduct) {
      getNewCommentList(newProduct.comments, index, (data) => {
        if (!data) {
          return callback(constants.response.paramValueInvalid);
        }

        const response = {
          code: constants.response.ok.code,
          message: constants.response.ok.message,
          data,
        };

        return callback(response);
      });
    }
  }).catch((err) => {
    logger.error('Error at function addProductComment.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.deleteProduct = (productId, userId, callback) => {
  const promiseProduct = productRepo.getProductDetail(productId);
  promiseProduct.then((product) => {
    if (!product) {
      return callback(constants.response.productNotExist);
    }

    const { seller } = product;
    if (seller.id !== userId) {
      return callback(constants.response.notAccess);
    }

    return productRepo.deleteProduct(productId);
  }).then((data) => {
    if (data) {
      return callback(constants.response.ok);
    }
  }).catch((err) => {
    logger.error('Error at function deleteProduct.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.likeProduct = (productId, userId, callback) => {
  const promiseProduct = productRepo.getProductDetail(productId);
  let productData;

  promiseProduct.then((product) => {
    if (!product) {
      return callback(constants.response.productNotExist);
    }
    productData = product;

    return likeRepo.getLikeUserProduct(userId, productId);
  }).then((like) => {
    if (like) {
      const likeData = {
        user: userId,
        product: productId,
        is_liked: 1,
      };

      return likeRepo.findAndUpdateLike(like, likeData);
    }
  }).then((data) => {
    if (data) {
      productData.like = (data.is_liked === 1) ? (productData.like + 1) : (productData.like - 1);

      return productRepo.findAndUpdateProduct(productId, productData, { new: true });
    }
  }).then((product) => {
    if (product) {
      const responseData = {
        code: constants.response.ok.code,
        message: constants.response.ok.message,
        data: {
          like: product.like,
        },
      };

      return callback(responseData);
    }
  }).catch((err) => {
    logger.error('Error at function likeProduct.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.reportProduct = (productId, subject, details, userId, callback) => {
  const promiseProduct = productRepo.getProductDetail(productId);
  promiseProduct.then((product) => {
    if (!product) {
      return callback(constants.response.productNotExist);
    }

    const reportData = {
      reporter: userId,
      product: productId,
      subject,
      details,
    };

    return reportRepo.saveReport(reportData);
  }).then((data) => {
    if (data) {
      return callback(constants.response.ok);
    }
  }).catch((err) => {
    logger.error('Error at function reportProduct.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.getMyLikeProductList = (index, count, userId, callback) => {
  const promise = likeRepo.getMyLikeProductList(userId, count, index);
  promise.then((likes) => {
    const data = likes.map((like) => {
      return {
        id: like.product.id,
        name: like.product.name,
        price: like.product.price,
        image: like.product.media.urls,
      };
    });

    const responseData = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data,
    };
    return callback(responseData);
  }).catch((err) => {
    logger.error('Error at function getMyLikeProductList.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.getNewItemNumber = (lastId, categoryId, callback) => {
  const promise = productRepo.getNewItemNum(lastId, categoryId);
  promise.then((newItemNum) => {
    const responseData = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data: {
        newItems: newItemNum,
      },
    };
    return callback(responseData);
  }).catch((err) => {
    logger.error('Error at function getNewItemNumber.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.addProduct = (data, userId, callback) => {
  const {
    price, name, categoryId, shipsFrom, shipsFromId, condition,
    brandId, productSizeId, described, weight, dimension, image, video, thumb,
  } = data;
  let media;
  if (!helpers.isExist(image)) {
    media = {
      type: constants.product.media.type.video,
      urls: [video],
      thumb,
    };
  } else {
    media = {
      type: constants.product.media.type.image,
      urls: image,
      thumb: null,
    };
  }
  const productData = {
    name,
    media,
    seller: userId,
    price,
    price_percent: 0,
    description: !helpers.isExist(described) ? '' : described,
    ships_from: shipsFrom,
    ships_from_ids: shipsFromId,
    condition,
    sizes: !helpers.isExist(productSizeId) ? [] : [productSizeId],
    brands: !helpers.isExist(brandId) ? [] : [brandId],
    categories: [categoryId],
    url: '/products/detail',
    weight: !helpers.isExist(weight) ? '' : weight,
    dimension: !helpers.isExist(dimension) ? [] : dimension,
    comments: [],
    campaigns: [],
  };

  const promise = productRepo.addProduct(productData);
  promise.then((newProduct) => {
    const responseData = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data: {
        id: newProduct.id,
        url: newProduct.url,
      },
    };

    return callback(responseData);
  }).catch((err) => {
    logger.error('Error at function addProduct.\n', err);
    return callback(constants.response.systemError);
  });
};

function getProductAttributes(products, userId, callback) {
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
          brand: getProductItemList(product.brands),
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
        return callback(productArr);
      }
    }).catch(() => {
      count += 1;
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
  const productOfUserNum = productRepo.getProductOfUser(seller.id);

  Promise.all([
    isLiked,
    isBlocked,
    productOfUserNum,
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
        size: getProductItemList(product.sizes),
        brand: getProductItemList(product.brands),
        seller: {
          id: seller.id,
          name: seller.name,
          avatar: seller.avatar,
          score: Math.round(Math.random() * 5),
          listing: listingProduct,
        },
        category: getProductItemList(product.categories, 'category'),
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
    logger.error('Error at function getResponseForProductDetail in getProductDetail.\n', err);
    return callback(constants.response.systemError);
  });
}

function getProductItemList(itemList, type = null) {
  if (type === 'category') {
    return itemList.map((item) => {
      return {
        id: item.id,
        name: item.name,
        hasBrand: item.has_brand,
        hasName: item.has_name,
      };
    });
  }
  return itemList.map((item) => {
    return {
      id: item.id,
      name: item.name,
    };
  });
}

function getNewCommentList(comments, commentId, callback) {
  const commentIdList = comments.map(comment => comment.id);
  const tempComments = comments;
  let index = 0;
  if (commentId !== 0) {
    index = commentIdList.indexOf(commentId);
    tempComments.splice(0, index + 1);
  }
  if (index > -1) {
    const newComments = tempComments.map((comment) => {
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
    return callback(newComments);
  }
  return callback(null);
}

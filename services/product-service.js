const productRepo = require('../repositories/product-repository');
const likeRepo = require('../repositories/like-repository');
const blockRepo = require('../repositories/block-repository');
const reportRepo = require('../repositories/report-repository');
const mime = require('mime');

const {
  constants, logger, helpers, googleDriver,
} = global;

exports.getProductList = (data, callback) => {
  const {
    categoryId, campaignId, lastId, count, index, userId,
  } = data;

  let response = {};
  let products = null;

  const promise = productRepo.getProductList(categoryId, campaignId, lastId, count);
  promise.then((productList) => {
    products = productList;

    if (!products || products.length === 0) {
      return null;
    }

    return productRepo.getNewItemNum(index, categoryId);
  }).then((newItemNum) => {
    if (!products || products.length === 0) {
      return callback(constants.response.noDataOrEndListData);
    }

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
      isBlocked: isBlocked ? 1 : 0,
    };

    return callback(response);
  }).catch((err) => {
    logger.error('Error at function getProductCommentList.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.addProductComment = (productId, comment, index, userId, callback) => {
  const promise = productRepo.getProductCommentList(productId);
  let product = null;
  promise.then((productData) => {
    product = productData;
    if (!product) {
      return null;
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
    if (!product) {
      return callback(constants.response.productNotExist);
    }

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
  }).catch((err) => {
    logger.error('Error at function addProductComment.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.deleteProduct = (productId, userId, callback) => {
  const promiseProduct = productRepo.getProductDetail(productId);
  let product = null;
  let isSeller = false;
  promiseProduct.then((productData) => {
    product = productData;

    if (!product) {
      return null;
    }

    const { seller } = product;
    if (!seller || seller.id !== userId) {
      return null;
    }

    isSeller = true;
    return productRepo.deleteProduct(productId);
  }).then((data) => {
    if (!product) {
      return callback(constants.response.productNotExist);
    }

    if (!isSeller) {
      return callback(constants.response.notAccess);
    }

    return callback(constants.response.ok);
  }).catch((err) => {
    logger.error('Error at function deleteProduct.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.likeProduct = (productId, userId, callback) => {
  const promiseProduct = productRepo.getProductDetail(productId);
  let product;

  promiseProduct.then((productData) => {
    product = productData;

    if (!product) {
      return null;
    }

    return likeRepo.getLikeUserProduct(userId, productId);
  }).then((like) => {
    if (!product) {
      return null;
    }

    const likeData = {
      user: userId,
      product: productId,
      is_liked: 1,
    };

    return likeRepo.findAndUpdateLike(like, likeData, { new: true });
  }).then((data) => {
    if (!product) {
      return null;
    }

    product.like = (data.is_liked === 1) ? (product.like + 1) : (product.like - 1);

    return productRepo.findAndUpdateProduct(productId, product, { new: true });
  }).then((productData) => {
    if (!product) {
      return callback(constants.response.productNotExist);
    }
    const responseData = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data: {
        like: productData.like,
      },
    };

    return callback(responseData);
  }).catch((err) => {
    logger.error('Error at function likeProduct.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.reportProduct = (productId, subject, details, userId, callback) => {
  const promiseProduct = productRepo.getProductDetail(productId);
  let product = null;

  promiseProduct.then((productData) => {
    product = productData;

    if (!product) {
      return null;
    }

    const reportData = {
      reporter: userId,
      product: productId,
      subject,
      details,
    };

    return reportRepo.saveReport(reportData);
  }).then((data) => {
    if (!product) {
      return callback(constants.response.productNotExist);
    }

    return callback(constants.response.ok);
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
    saveAllFile([video], (videoUrl) => {
      saveAllFile([thumb], (thumbUrl) => {
        media = {
          type: constants.product.media.type.video,
          urls: videoUrl,
          thumb: thumbUrl[0],
        };
      });
    });
  } else {
    saveAllFile(image, (imageIdList) => {
      media = {
        type: constants.product.media.type.image,
        urls: imageIdList,
        thumb: null,
      };
    });
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

exports.getUserListing = (userListingParams, callback) => {

  const { myId } = userListingParams;
  const promise = productRepo.getProductOfUser(userListingParams);

  promise.then((products) => {
    if (!products || products.length === 0) {
      return callback(constants.response.noDataOrEndListData);
    }

    getProductAttributes(products, myId, (productArr) => {
      const data = productArr.map((product) => {
        delete product.isBlocked;
        delete product.seller;
        delete product.canEdit;
        delete product.brand;
        delete product.described;
        return product;
      });

      const response = {
        code: constants.response.ok.code,
        message: constants.response.ok.message,
        data,
      };

      return callback(response);
    });
  }).catch((err) => {
    logger.error('Error at function getUserListing.\n', err);
    callback(constants.response.systemError);
  });
};

exports.editProduct = (data, userId, callback) => {
  const {
    productId, price, name, categoryId, shipsFrom, shipsFromId, condition, brandId,
    productSizeId, described, weight, dimension, image, imageDel, video, thumb,
  } = data;

  const select = '';
  const promise = productRepo.getProductWithOptionSelect(productId, select);
  let product = null;
  let isSeller = false;
  promise.then((productData) => {
    product = productData;
    if (!product) {
      return null;
    }
    if (product.seller.toString() !== userId) {
      return null;
    }

    isSeller = true;
    let { media } = product;
    if (helpers.isExist(imageDel) && imageDel.length > 0) {
      if (media.type === 0) {
        deleteFile(imageDel, imageDel, () => {
          logger.success('Delete success image product.\n');
        });
      }
    }

    if (helpers.isExist(video)) {
      saveAllFile([video], (videoUrl) => {
        saveAllFile([thumb], (thumbUrl) => {
          media = {
            type: constants.product.media.type.video,
            urls: videoUrl,
            thumb: thumbUrl[0],
          };
        });
      });
    } else if (helpers.isExist(image)) {
      saveAllFile(image, (imageUrlList) => {
        media = {
          type: constants.product.media.type.image,
          urls: imageUrlList,
          thumb: null,
        };
      });
    }
    const productNewData = {
      name,
      media,
      seller: userId,
      price,
      price_percent: product.price_percent,
      description: described === 0 ? product.description : described,
      ships_from: shipsFrom === 0 ? product.ships_from : shipsFrom,
      ships_from_ids: shipsFromId,
      condition: condition === '' ? product.condition : condition,
      sizes: [productSizeId],
      brands: [brandId],
      categories: [categoryId],
      url: product.url,
      weight: weight === 0 ? product.weight : weight,
      dimension: !helpers.isExist(dimension) ? product.dimension : dimension,
      comments: product.comments,
      campaigns: product.campaigns,
    };

    return productRepo.findAndUpdateProduct(productId, productNewData, { new: true });
  }).then((newProduct) => {
    if (!product) {
      return callback(constants.response.noDataOrEndListData);
    }

    if (!isSeller) {
      return callback(constants.response.notAccess);
    }

    return callback(constants.response.ok);
  }).catch((err) => {
    logger.error('Error at function editProduct.\n', err);
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
          isLiked: isUserLiked ? 1 : 0,
          isBlocked: isUserBlocked ? 1 : 0,
          canEdit: canEdit ? 1 : 0,
          banned: product.banned,
          seller: {
            id: seller.id,
            username: seller.username,
            avatar: seller.avatar,
          },
        };

        if (product.media.type === constants.product.media.type.image) {
          product.media.urls.forEach((item) => {
            oneProduct.image.push(item);
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
  const productOfUserNum = productRepo.getProductOfUserById(seller.id);

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
        isLiked: isUserLiked ? 1 : 0,
        image: [],
        video: [],
        size: getProductItemList(product.sizes),
        brand: getProductItemList(product.brands),
        seller: {
          id: seller.id,
          name: seller.username,
          avatar: seller.avatar,
          score: 0,
          listing: listingProduct,
        },
        category: getProductItemList(product.categories, 'category'),
        isBlocked: isUserBlocked ? 1 : 0,
        canEdit: canEdit ? 1 : 0,
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
        hasBrand: parseInt(item.has_brand, 10),
        hasName: parseInt(item.has_name, 10),
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

function saveAllFile(files, callback) {
  const fileList = files.map((file) => {
    return {
      fileName: `${file.name}_${new Date().getTime()}`,
      type: mime.getType(file.path),
      pathFile: file.path,
    };
  });
  googleDriver.authDriver((auth) => {
    helpers.uploadFile(auth, fileList, callback);
  });
}

function deleteFile(fileIds, callback) {
  googleDriver.authDriver((auth) => {
    helpers.deleteFile(auth, fileIds, callback);
  });
}

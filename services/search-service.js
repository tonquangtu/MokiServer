const likeRepo = require('../repositories/like-repository');
const searchHistoryRepo = require('../repositories/search-history-repository');
const searcher = require('../searches/elasticsearch');

const { constants, logger } = global;

exports.searchProducts = (searchParams, callback) => {
  const selectFields = ['name', 'media', 'price', 'price_percent', 'like', 'comment'];
  const fullSearchParams = Object.assign({}, searchParams, { selectFields });
  const { userId } = fullSearchParams;
  let products = null;

  searcher
    .searchProducts(fullSearchParams)
    .then(esResponse => getProdsFromESResponse(esResponse))
    .then((items) => {
      products = items;
      if (!products || !userId) {
        return null;
      }
      const promisesCheckLiked = products.map(item => likeRepo.getLikeUserProduct(userId, item.id));
      return Promise.all(promisesCheckLiked);
    })
    .then((userLikes) => {
      let response;
      if (!products) {
        return callback(constants.response.searchNotFound);
      }

      if (!userLikes) {
        response = {
          code: constants.response.ok.code,
          message: constants.response.ok.message,
          data: products,
        };
      } else {
        let i = 0;
        const productsWithLike = products.map((product) => {
          const isLiked = userLikes[i] ? userLikes[i].is_liked : 0;
          const item = Object.assign({}, product, { isLiked });
          i += 1;
          return item;
        });
        response = {
          code: constants.response.ok.code,
          message: constants.response.ok.message,
          data: productsWithLike,
        };
      }
      return callback(response);
    })
    .catch((err) => {
      logger.error('Error at function searchProducts in search-service.\n', err);
      return callback(constants.response.systemError);
    });
};

exports.deleteSaveSearch = (searchId, userId, callback) => {
  const promise = searchHistoryRepo.getSearchHistoryById(searchId);
  let searchHistory = null;
  let isUser = false;
  promise.then((searchHistoryData) => {
    searchHistory = searchHistoryData;
    if (!searchHistory) {
      return null;
    }

    if (searchHistory.user.toString() !== userId) {
      return null;
    }

    isUser = true;
    return searchHistoryRepo.deleteSearchHistory(searchId);
  }).then((data) => {
    if (!searchHistory) {
      return callback(constants.response.noDataOrEndListData);
    }

    if (!isUser) {
      return callback(constants.response.notAccess);
    }

    return callback(constants.response.ok);
  }).catch((err) => {
    logger.error('Error at function deleteSaveSearch.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.saveSearch = (validSaveSearchParams, userId, callback) => {
  const {
    keywordValid,
    categoryIdValid,
    brandIdValid,
    productSizeIdValid,
    priceMaxValid,
    priceMinValid,
    conditionValid,
  } = validSaveSearchParams;
  const searchHistoryData = {
    user: userId,
  };
  if (keywordValid !== 0) {
    searchHistoryData.keyword = keywordValid;
  }
  if (categoryIdValid !== 0) {
    searchHistoryData.category = categoryIdValid;
  }
  if (brandIdValid !== 0) {
    searchHistoryData.brand = brandIdValid;
  }
  if (productSizeIdValid !== 0) {
    searchHistoryData.product_size = productSizeIdValid;
  }
  if (priceMinValid !== '') {
    searchHistoryData.price_min = priceMinValid;
  }
  if (priceMaxValid !== '') {
    searchHistoryData.price_max = priceMaxValid;
  }
  if (conditionValid !== '') {
    searchHistoryData.condition = conditionValid;
  }
  const promise = searchHistoryRepo.saveSearchHistory(searchHistoryData);
  promise.then((searchHistory) => {
    return callback(constants.response.ok);
  }).catch((err) => {
    logger.error('Error at function saveSearch.\n', err);
    return callback(constants.response.systemError);
  });
};

function getProdsFromESResponse(esResponse) {
  if (!esResponse || !esResponse.hits || esResponse.hits.total < 1) {
    return null;
  }
  const { hits } = esResponse.hits;
  logger.info(`Search take: ${esResponse.took}  ms\n`);

  return hits.map((item) => {
    let image = null;
    let video = null;
    const itemData = item._source;
    const { media } = itemData;

    if (media.urls.length > 0) {
      if (media.type === constants.product.media.type.image) {
        image = media.urls[0];
      } else {
        video = {
          thumb: media.thumb,
          url: media.urls[0],
        };
      }
    }

    return {
      id: item._id,
      name: itemData.name,
      image,
      video,
      price: itemData.price,
      pricePercent: itemData.pricePercent,
      like: itemData.like,
      comment: itemData.comment,
    };
  });
}

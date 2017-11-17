const likeRepo = require('../repositories/like-repository');
const searchHistoryRepo = require('../repositories/search-history-repository');
const searcher = require('../searches/elasticsearch');

const { constants, logger, helpers } = global;

exports.searchProducts = (searchParams, callback) => {
  const selectFields = ['name', 'media', 'price', 'price_percent', 'like', 'comment'];
  const fullSearchParams = Object.assign({}, searchParams, { selectFields });
  const { userId } = fullSearchParams;
  let products = [];

  searcher
    .searchProducts(fullSearchParams)
    .then((esResponse) => {
      const results = getResultsFromESResponse(esResponse);
      if (!results || results.length < 1) {
        return Promise.reject(constants.response.searchNotFound);
      }

      products = results;
      if (!userId) {
        return null;
      }

      const promisesCheckLiked = products.map(item => likeRepo.getLikeUserProduct(userId, item.id));
      return Promise.all(promisesCheckLiked);
    })
    .then((userLikes) => {
      if (userLikes) {
        products.forEach((product, i) => {
          products[i].isLiked = userLikes[i] ? userLikes[i].is_liked : 0;
        });
      }

      const response = {
        code: constants.response.ok.code,
        message: constants.response.ok.message,
        data: products,
      };
      logger.info(`Search results: ${products.length}`);
      return callback(response);
    })
    .catch((err) => {
      let errResponse = err;
      if (err !== constants.response.searchNotFound) {
        errResponse = constants.response.systemError;
        logger.error('Error at function searchProducts in search-service.\n', err);
      }
      return callback(errResponse);
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
  promise.then(searchHistory => callback(constants.response.ok)).catch((err) => {
    logger.error('Error at function saveSearch.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.getSaveSearchList = (indexValid, countValid, userId, callback) => {
  const promise = searchHistoryRepo.getSearchHistoryList(indexValid, countValid, userId);
  promise.then((searchHistoryList) => {
    if (searchHistoryList.length === 0) {
      return callback(constants.response.noDataOrEndListData);
    }

    const data = searchHistoryList.map((searchHistory) => {
      const {
        id, keyword, category, brand, product_size, price_min, price_max, condition,
      } = searchHistory;

      const oneData = {
        id,
      };

      if (helpers.isExist(keyword)) {
        oneData.keyword = keyword;
      }

      if (helpers.isExist(category)) {
        oneData.category = {
          id: searchHistory.category.id,
          name: searchHistory.category.name,
        };
      }

      if (helpers.isExist(brand)) {
        oneData.brand = {
          id: searchHistory.brand.id,
          brandName: searchHistory.brand.name,
        };
      }

      if (helpers.isExist(product_size)) {
        oneData.productSize = {
          id: searchHistory.product_size.id,
          sizeName: searchHistory.product_size.name,
        };
      }

      if (helpers.isExist(price_min)) {
        oneData.priceMin = price_min;
      }

      if (helpers.isExist(price_max)) {
        oneData.priceMax = price_max;
      }

      if (helpers.isExist(condition)) {
        oneData.condtion = condition;
      }
      return oneData;
    });

    const responseData = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data,
    };

    return callback(responseData);
  }).catch((err) => {
    logger.error('Error at function getSaveSearchList.\n', err);
    return callback(constants.response.systemError);
  });
};

function getResultsFromESResponse(esResponse) {
  if (!esResponse || !esResponse.hits || esResponse.hits.total < 1) {
    return null;
  }
  const { hits } = esResponse.hits;
  logger.info(`Search take: ${esResponse.took}  ms\n`);

  return hits.map((item) => {
    const sourceData = item._source;
    let image = null;
    let video = null;
    const { media } = sourceData;

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
      name: sourceData.name,
      image,
      video,
      price: sourceData.price,
      pricePercent: sourceData.pricePercent,
      like: sourceData.like,
      comment: sourceData.comment,
      isLiked: 0,
    };
  });
}

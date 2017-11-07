const searchService = require('../services/search-service');

const { constants, helpers } = global;

exports.searchProducts = (req, res) => {
  const searchParams = req.body;
  if (!searchParams) {
    helpers.sendResponse(res, constants.response.paramValueInvalid);
  } else {
    const validSearchParams = validateSearchParams(searchParams);
    if (!validSearchParams) {
      helpers.sendResponse(res, constants.response.paramValueInvalid);
    } else {
      searchService.searchProducts(validSearchParams, (response) => {
        helpers.sendResponse(res, response);
      });
    }
  }
};

exports.deleteSaveSearch = (req, res) => {
  const data = req.body;
  if (!data || !helpers.isExist(data.searchId)) {
    helpers.sendResponse(res, constants.response.paramNotEnough);
  } else {
    const { searchId } = data;

    if (!helpers.isValidId(searchId)) {
      helpers.sendResponse(res, constants.response.paramValueInvalid);
    } else {
      searchService.deleteSaveSearch(searchId, req.user.id, (responseData) => {
        helpers.sendResponse(res, responseData);
      });
    }
  }
};

exports.saveSearch = (req, res) => {
  const data = req.body;

  if (!data) {
    helpers.sendResponse(res, constants.response.paramNotEnough);
  } else {
    const {
      keyword, categoryId, brandId, productSizeId, priceMin, priceMax, condition,
    } = data;

    const validSaveSearchParams = validateSaveSearchParams(data);
    const {
      keywordValid, categoryIdValid, brandIdValid,
      productSizeIdValid, priceMinValid, priceMaxValid, conditionValid,
    } = validSaveSearchParams;

    if (!helpers.isExist(keyword) && !helpers.isExist(categoryId)
      && !helpers.isExist(brandId) && !helpers.isExist(productSizeId)
      && !helpers.isExist(priceMin) && !helpers.isExist(priceMax)
      && !helpers.isExist(condition)) {
      helpers.sendResponse(res, constants.response.paramNotEnough);
    } else if (
      (keywordValid === null) || (priceMinValid === null)
      || (priceMaxValid === null) || (conditionValid === null)) {
      helpers.sendResponse(res, constants.response.paramTypeInvalid);
    } else if (
      (categoryIdValid !== 0 && !helpers.isValidId(categoryIdValid))
      || (brandIdValid !== 0 && !helpers.isValidId(brandIdValid))
      || (productSizeIdValid !== 0 && !helpers.isValidId(productSizeIdValid))
      || (priceMinValid !== '' && priceMinValid < 0)
      || (priceMaxValid !== '' && priceMaxValid <= 0)
      || (conditionValid !== '' && conditionValid <= 0)
    ) {
      helpers.sendResponse(res, constants.response.paramValueInvalid);
    } else {
      searchService.saveSearch(validSaveSearchParams, req.user.id, (responseData) => {
        helpers.sendResponse(res, responseData);
      });
    }
  }
};

exports.getSaveSearchList = (req, res) => {
  const data = req.body;
  if (!data || !helpers.isExist(data.index) || !helpers.isExist(data.count)) {
    helpers.sendResponse(res, constants.response.paramNotEnough);
  } else {
    const indexValid = helpers.validInteger(data.index);
    const countValid = helpers.validInteger(data.count);

    if (indexValid === null || countValid === null) {
      helpers.sendResponse(res, constants.response.paramTypeInvalid);
    } else if (indexValid < 0 || countValid < 0) {
      helpers.sendResponse(res, constants.response.paramValueInvalid);
    } else {
      searchService.getSaveSearchList(indexValid, countValid, req.user.id, (responseData) => {
        helpers.sendResponse(res, responseData);
      });
    }
  }
};

function validateSearchParams(searchParams) {
  const {
    token,
    keyword,
    categoryId,
    brandId,
    productSizeId,
    priceMin,
    priceMax,
    condition,
    index,
    count,
  } = searchParams;
  const user = helpers.getUserFromToken(token);
  const validKeyword = helpers.validString(keyword);
  const isValidCategoryId = helpers.isValidId(categoryId);
  const isValidBrandId = helpers.isValidId(brandId);
  const isValidProductSizeId = helpers.isValidId(productSizeId);
  const validPriceMin = helpers.validNumber(priceMin);
  const validPriceMax = helpers.validNumber(priceMax);
  const validCondition = helpers.validString(condition);
  const validIndex = helpers.validNumber(index);
  const validCount = helpers.validNumber(count);
  const userId = user ? user.id : null;
  let isValidPrice = false;
  if (validPriceMin && validPriceMax && validPriceMax >= validPriceMin) {
    isValidPrice = true;
  }

  if ((!validIndex && validIndex !== 0) || !validCount) {
    return null;
  }

  if (validKeyword || isValidCategoryId || isValidBrandId
  || isValidProductSizeId || isValidPrice || validCondition) {
    return {
      userId,
      categoryId,
      brandId,
      productSizeId,
      keyword: validKeyword,
      priceMin: validPriceMin,
      priceMax: validPriceMax,
      condition: validCondition,
      fromIndex: validIndex,
      limit: validCount,
    };
  }
  return null;
}

function validateSaveSearchParams(saveSearchParams) {
  const {
    keyword, categoryId, brandId, productSizeId, priceMin, priceMax, condition,
  } = saveSearchParams;
  const keywordValid = helpers.isExist(keyword) ? helpers.validString(keyword) : 0;
  const categoryIdValid = helpers.isExist(categoryId) ? categoryId : 0;
  const brandIdValid = helpers.isExist(brandId) ? brandId : 0;
  const productSizeIdValid = helpers.isExist(productSizeId) ? productSizeId : 0;
  const priceMinValid = helpers.isExist(priceMin) ? helpers.validInteger(priceMin) : '';
  const priceMaxValid = helpers.isExist(priceMax) ? helpers.validInteger(priceMax) : '';
  const conditionValid = helpers.isExist(condition) ? helpers.validInteger(condition) : '';

  return {
    keywordValid,
    categoryIdValid,
    brandIdValid,
    productSizeIdValid,
    priceMaxValid,
    priceMinValid,
    conditionValid,
  };
}

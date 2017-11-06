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

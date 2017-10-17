const searchService = require('../services/search-service');

const { constants, helpers } = global;

exports.simpleSearchProducts = (req, res) => {
  searchProducts(req, res, constants.search.simple);
};

exports.fullSearchProducts = (req, res) => {
  searchProducts(req, res, constants.search.full);
};


function searchProducts(req, res, searchType) {
  let statusCode;
  const searchParams = req.body;
  if (!searchParams) {
    statusCode = 404;
    helpers.sendResponse(res, statusCode, constants.response.paramValueInvalid);
  } else {
    const validSearchParams = validateSearchParams(searchParams);
    if (!validSearchParams) {
      statusCode = 404;
      helpers.sendResponse(res, statusCode, constants.response.paramValueInvalid);
    } else if (searchType === constants.search.simple) {
      searchService.simpleSearchProducts(searchParams, (response) => {
        statusCode = 200;
        helpers.sendResponse(res, statusCode, response);
      });
    } else {
      searchService.searchProducts(searchParams, (response) => {
        statusCode = 200;
        helpers.sendResponse(res, statusCode, response);
      });
    }
  }
}

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
  const validKeyword = helpers.validString(keyword);
  const isValidCategoryId = helpers.isValidId(categoryId);
  const isValidBrandId = helpers.isValidId(brandId);
  const isValidProductSizeId = helpers.isValidId(productSizeId);
  const validPriceMin = helpers.validNumber(priceMin);
  const validPriceMax = helpers.validNumber(priceMax);
  const validCondition = helpers.validString(condition);
  const validIndex = helpers.validNumber(index);
  const validCount = helpers.validNumber(count);
  let isValidPrice = false;
  if (validPriceMin && validPriceMax && validPriceMax >= validPriceMin) {
    isValidPrice = true;
  }

  if (validKeyword || isValidCategoryId || isValidBrandId
  || isValidProductSizeId || isValidPrice || validCondition
  || validIndex || validCount) {
    return {
      token,
      categoryId,
      brandId,
      productSizeId,
      keyword: validKeyword,
      priceMin: validPriceMin,
      priceMax: validPriceMax,
      condition: validCondition,
      fromIndex: index,
      limit: validCount,
    };
  }
  return null;
}

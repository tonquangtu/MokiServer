const brandRepo = require('../repositories/brand-repository');
const categoryRepo = require('../repositories/category-repository');

const {constants, logger} = global;

exports.getBrandsByCategoryId = (categoryId, callback) => {
  const promise = categoryRepo.getBrandByCategoryId(categoryId);

  promise.then((value) => {
    const {brands} = value;
    const data = brands.map(brand => ({
      id: brand.id,
      brandName: brand.name,
    }));

    const response = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data,
    };

    return callback(response);
  }).catch((err) => {
    logger.error('Error at function getBrandsByCategoryId.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.getBrands = (callback) => {
  const promise = brandRepo.getBrands();

  promise.then((brands) => {
    const data = brands.map(brand => ({
      id: brand.id,
      brandName: brand.name,
    }));
    const response = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data,
    };

    return callback(response);
  }).catch((err) => {
    logger.error('Error at function getBrands.\n', err);
    return callback(constants.response.systemError);
  });
};

// Get brand in promise style
exports.getBrandsWithPromiseStyle = (brandId) => {
  return new Promise((resolved, rejected) => {
    const promise = brandRepo.getBrands();

    promise.then((brands) => {
      const data = brands.map(brand => ({
        id: brand.id,
        brandName: brand.name,
      }));
      const response = {
        code: constants.response.ok.code,
        message: constants.response.ok.message,
        data,
      };

      return resolved(response);
    }).catch((err) => {
      logger.error('Error at function getBrands.\n', err);
      return rejected(constants.response.systemError);
    });
  });
};

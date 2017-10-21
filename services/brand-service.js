const brandRepo = require('../repositories/brand-repository');
const categoryRepo = require('../repositories/category-repository');

const { constants, logger } = global;

exports.getBrandsByCategoryId = (categoryId, callback) => {
  const promise = categoryRepo.getBrandByCategoryId(categoryId);

  promise.then((value) => {
    const brandsGetFromRepo = value.brands;
    const data = brandsGetFromRepo.map(brand => ({
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

  promise.then((value) => {
    const data = value.map(brand => ({
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


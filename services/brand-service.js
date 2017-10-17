const brandRepo = require('../repositories/brand-repository');
const categoryRepo = require('../repositories/category-repository');

const { constants } = global;

exports.getBrandsByCategoryId = (categoryId, callback) => {
  const promise = categoryRepo.getBrandByCategoryId(categoryId);

  promise.then((value) => {
    console.log(value);
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
  }).catch(err => callback(constants.response.systemError));
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
  }).catch(err => callback(constants.response.systemError));
};


const sizeRepo = require('../repositories/size-repository');
const categoryRepo = require('../repositories/category-repository');

const { constants } = global;

exports.getSizesByCategoryId = (categoryId, callback) => {
  const promise = categoryRepo.getSizeArrayByCategoryId(categoryId);

  promise.then((value) => {
    // console.log(value);
    const sizesGetFromRepo = value.sizes;
    const data = sizesGetFromRepo.map(size => ({
      id: size.id,
      sizeName: size.name,
    }));

    const response = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data,
    };

    return callback(response);
  }).catch(err => callback(constants.response.systemError));
};

exports.getSizes = (callback) => {
  const promise = sizeRepo.getSizes();

  promise.then((value) => {
    // console.log(value);
    const data = value.map(size => ({
      id: size.id,
      sizeName: size.name,
    }));
    const response = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data,
    };

    return callback(response);
  }).catch(err => callback(constants.response.systemError));
};


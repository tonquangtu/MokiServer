const sizeRepo = require('../repositories/size-repository');
const categoryRepo = require('../repositories/category-repository');

const { constants, logger } = global;

exports.getSizesByCategoryId = (categoryId, callback) => {
  const promise = categoryRepo.getSizeArrayByCategoryId(categoryId);

  promise.then((value) => {
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
  }).catch((err) => {
    logger.error('Error at function getSizesByCategoryId.\n', err);
    return callback(constants.response.systemError);
  });
};

exports.getSizes = (callback) => {
  const promise = sizeRepo.getSizes();

  promise.then((value) => {
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
  }).catch((err) => {
    logger.error('Error at function getSizes.\n', err);
    return callback(constants.response.systemError);
  });
};


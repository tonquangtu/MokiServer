const sizeRepo = require('../repositories/size-repository');

const { constants } = global;

exports.getSizeList = (categoryId, callback) => {
  const promise = sizeRepo.getSizeArrayByCategoryId(categoryId);

  promise.then((value) => {
    const sizesGetFromRepo = value.sizes;
    console.log(sizesGetFromRepo);
    const data = sizesGetFromRepo.map((size) => {
      return {
        id: size.id,
        size_name: size.name
      }
    });

    const response = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data,
    };

    return callback(response);
  }).catch(err => callback(constants.response.systemError));

};

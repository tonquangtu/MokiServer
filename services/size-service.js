const sizeRepo = require('../repositories/size-repository');

const { constants } = global;

exports.getListSizes = (data, callback) => {
  const sizeId = data; // object

  const promise = sizeRepo.getSizeById(sizeId);

  promise.then((value) => {
    const response = {
      code: constants.response.ok.code,
      message: constants.response.ok.message,
      data: {
        id: value._id,
        sizeName: value.name,
      },
    };
    return callback(response);
  }).catch(err => callback(constants.response.systemError));

};

const categoryRepo = require('../repositories/category-repository');

const { constants, logger } = global;
const { helpers } = global;

exports.getCategories = (parentIdValid, callback) => {
  let responseCategoryByParentId = {};
  let dataSizes = [];
  let dataBrands = [];

  if (helpers.isValidId(parentIdValid)) {
    const promise = categoryRepo.getCategoryByParentId(parentIdValid);

    promise.then((listCategoryByParentId) => {
      if (listCategoryByParentId.length > 0) {
        responseCategoryByParentId = {
          parentId: parentIdValid,
          code: constants.response.ok.code,
          message: constants.response.ok.message,
          data: listCategoryByParentId,
        };
      } else {
        responseCategoryByParentId = {
          parentId: parentIdValid,
          code: 1017,
          message: 'parentId is not exits',
          data: listCategoryByParentId,
        };
      }

      return callback(responseCategoryByParentId);
    }).catch((err) => {
      logger.error('Error at function getCategories.\n', err);
      return callback(constants.response.systemError);
    });
  } else if (parentIdValid === '') {
    console.log('Zo id == null');
    const promise = categoryRepo.getCategoryNoParentId();

    promise.then((listCategoryNoParentId) => {
      const responseCategoryNoParentId = {
        code: constants.response.ok.code,
        message: constants.response.ok.message,
        data: listCategoryNoParentId,
      };

      return callback(responseCategoryNoParentId);
    }).catch((err) => {
      logger.error('Error at function getCategories.\n', err);
      return callback(constants.response.systemError);
    });
  } else {
    console.log('Zo khong ton tai id');
    const responseCategoryNoParentId = {
      code: 1017,
      message: 'Parent id is not exits',
      data: null,
    };
    return callback(responseCategoryNoParentId);
  }
};

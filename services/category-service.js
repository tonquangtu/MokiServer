const categoryRepo = require('../repositories/category-repository');

const { constants, logger } = global;

exports.getCategories = (parentIdValid, callback) => {

  if (parentIdValid === '') {
    const promise = categoryRepo.getCategoryNoParentId();

    promise.then((categoryList) => {
      const responseData = {
        code: constants.response.ok.code,
        message: constants.response.ok.message,
        data: setCategoryResponseData(categoryList),
      };

      return callback(responseData);
    }).catch((err) => {
      logger.error('Error at function getCategories.\n', err);
      return callback(constants.response.systemError);
    });
  } else {
    const promise = categoryRepo.getCategoryByParentId(parentIdValid);

    promise.then((categoryList) => {
      if (categoryList.length > 0) {
        const responseData = {
          code: constants.response.ok.code,
          message: constants.response.ok.message,
          data: setCategoryResponseData(categoryList),
        };
        return callback(responseData);
      }

      return callback(constants.response.noDataOrEndListData);
    }).catch((err) => {
      logger.error('Error at function getCategories.\n', err);
      return callback(constants.response.systemError);
    });
  }
};

function setCategoryResponseData(categoryList) {
  return categoryList.map((category) => {
    const sizes = category.sizes.map((size) => {
      return {
        id: size.id,
        name: size.name,
      };
    });

    const brands = category.brands.map((brand) => {
      return {
        id: brand.id,
        name: brand.name,
      };
    });
    return {
      id: category.id,
      name: category.name,
      hasBrand: category.has_brand,
      hasName: category.has_name,
      parentId: category.parent,
      hasChild: category.has_child,
      hasSize: category.has_size,
      createdAt: category.created_at,
      sizes,
      brands,
    };
  });
}


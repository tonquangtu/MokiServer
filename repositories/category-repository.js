const { Category } = global;

exports.getCategoryById = categoryId => Category.findById(categoryId).exec();

exports.getSizeArrayByCategoryId = (categoryId) => {
  return Category
    .findById(categoryId)
    .populate({ path: 'sizes', select: 'name' })
    .exec();
};

exports.getBrandByCategoryId = categoryId => Category
  .findById(categoryId)
  .populate({ path: 'brands' })
  .exec();

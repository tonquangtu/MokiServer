const { Category } = global;

exports.getCategoryById = categoryId => Category.findById(categoryId).exec();

exports.getSizeArrayByCategoryId = (categoryId) => {
  return Category
    .findById(categoryId)
    .populate({ path: 'sizes', select: 'name' })
    .exec();
};

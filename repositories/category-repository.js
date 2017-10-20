const { Category } = global;

const { mongoose } = global;

exports.getCategoryById = categoryId => Category.findById(categoryId).exec();

exports.getSizeArrayByCategoryId = (index) => {
  const categoryId = new mongoose.Types.ObjectId(index);
  return Category
    .findById(categoryId)
    .populate({ path: 'sizes', select: 'name' })
    .exec();
};

exports.getBrandByCategoryId = categoryId => Category
  .findById(categoryId)
  .populate({ path: 'brands' })
  .exec();

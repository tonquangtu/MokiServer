const Category = require('../models/category');

const { mongoose } = global;

exports.getCategoryById = categoryId => Category.findById(categoryId).exec();

exports.getSizeArrayByCategoryId = (index) => {
  const categoryId = new mongoose.Types.ObjectId(index);
  return Category
    .findById(categoryId)
    .populate({ path: 'sizes', select: 'name' })
    .exec();
};

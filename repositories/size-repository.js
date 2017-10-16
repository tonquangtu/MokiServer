const Size = require('../models/size');
const Category = require('../models/category');

const { mongoose } = global;

exports.getSizeArrayByCategoryId = (index) => {
  const categoryId = new mongoose.Types.ObjectId(index);
  return Category
    .findById(categoryId)
    .populate({ path: 'sizes', select: 'name' })
    .exec();
};

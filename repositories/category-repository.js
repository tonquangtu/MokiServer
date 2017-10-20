const { Category } = global;

exports.getCategoryById = categoryId => Category.findById(categoryId).exec();

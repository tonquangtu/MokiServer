const Category = require('../models/category');

exports.getCategoryById = categoryId => Category.findById(categoryId).exec();

const { Category } = global;

exports.getCategoryById = categoryId => Category.findById(categoryId).exec();

exports.getSizeArrayByCategoryId = categoryId => Category
  .findById(categoryId)
  .populate({ path: 'sizes', select: 'name' })
  .exec();

exports.getBrandByCategoryId = categoryId => Category
  .findById(categoryId)
  .populate({ path: 'brands' })
  .exec();

exports.getCategoryNoParentId = () => Category
  .find({ parent: null })
  .select('name has_brand has_name parent has_child has_size created_at sizes brands')
  .exec();

exports.getCategoryByParentId = parentIdValid => Category
  .find({ parent: parentIdValid })
  .select('name has_brand has_name parent has_child has_size created_at sizes brands')
  .exec();

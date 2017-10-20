const { Brand } = global;

exports.getBrandById = brandId => Brand.findById(brandId).exec();

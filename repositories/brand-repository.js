const { Brand } = global;

const { mongoose } = global;

exports.getBrandById = brandId => Brand.findById(brandId).exec();

exports.getBrands = () => Brand.find().exec();

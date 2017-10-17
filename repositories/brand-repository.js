const Brand = require('../models/brand');

const { mongoose } = global;

exports.getBrandById = brandId => Brand.findById(brandId).exec();

exports.getBrands = () => Brand.find().exec();

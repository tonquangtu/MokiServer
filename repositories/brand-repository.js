const Brand = require('../models/brand');

exports.getBrandById = brandId => Brand.findById(brandId).exec();

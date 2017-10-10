const Size = require('../models/size');

exports.getSizeById = sizeId => Size.findById(sizeId).exec();

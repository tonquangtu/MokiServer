const { Size } = global;

exports.getSizeById = sizeId => Size.findById(sizeId).exec();

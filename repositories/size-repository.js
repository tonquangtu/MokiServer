const { Size } = global;

const { mongoose } = global;

exports.getSizes = () => Size.find().exec();

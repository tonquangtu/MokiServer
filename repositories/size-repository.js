const Size = require('../models/size');
const Category = require('../models/category');

const { mongoose } = global;

exports.getSizes = () => Size.find().exec();

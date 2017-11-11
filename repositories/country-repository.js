const { Country, mongoose } = global;
const id = '59e80ebc93e5f40e2cc1d94e';
const idObj = new mongoose.mongo.ObjectId(id);

exports.getProvinces = () => Country
  .findOne({ _id: id }, { _id: 0 })
  .select('provinces.order provinces.name')
  .exec();

exports.getDistricts = () => Country
  .aggregate([
    { $match: { _id: idObj } },
    { $unwind: '$provinces' },
    { $unwind: '$provinces.districts' },
    { $project: { 'provinces.districts.name': 1, 'provinces.districts.order': 1 } },
    { $group: { _id: '$_id', districts: { $push: '$provinces.districts' } } },
  ])
  .exec();

// Cach 1
// exports.getListDistrictByParentId = parentIdValid => Country
//   .findOne(
//     { 'provinces.order': parentIdValid },
//     { _id: 0, provinces: { $elemMatch: { order: parentIdValid } } })
//   .select('provinces.order provinces.districts.order provinces.districts.name')
//   .exec();

// Cach 2
exports.getListDistrictByParentId = parentIdValid => Country
  .aggregate([
    { $unwind: '$provinces' },
    { $match: { 'provinces.order': parentIdValid } },
    {
      $project: {
        _id: 0, 'provinces.order': 1, 'provinces.districts.name': 1, 'provinces.districts.order': 1,
      },
    },
  ])
  .exec();

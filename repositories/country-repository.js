const { Country, mongoose } = global;

exports.getProvinces = () => Country
  .findOne({}, { _id: 0 })
  .select('provinces.order provinces.name')
  .exec();

exports.getDistricts = () => Country
  .aggregate([
    { $unwind: '$provinces' },
    { $unwind: '$provinces.districts' },
    { $project: { 'provinces.districts.name': 1, 'provinces.districts.order': 1 } },
    { $group: { _id: null, first: { $first: '$$ROOT' }, districts: { $push: '$provinces.districts' } } },
  ])
  .exec();

exports.getTowns = () => Country
  .aggregate([
    { $unwind: '$provinces' },
    { $unwind: '$provinces.districts' },
    { $unwind: '$provinces.districts.towns' },
    { $project: { _id: 0, 'provinces.districts.towns.name': 1, 'provinces.districts.towns.order': 1 } },
    { $group: { _id: null, first: { $first: '$$ROOT' }, winds: { $push: '$provinces.districts.towns' } } },
  ])
  .exec();

exports.getListDistrictByParentId = parentIdValid => Country
  .aggregate([
    { $unwind: '$provinces' },
    { $match: { 'provinces.order': parentIdValid } },
    {
      $project: {
        _id: 0, 'provinces.order': 1, 'provinces.districts.name': 1,
      },
    },
  ])
  .exec();

exports.getListTownByParentId = parentIdValid => Country
  .aggregate([
    { $unwind: '$provinces' },
    { $unwind: '$provinces.districts' },
    { $match: { 'provinces.districts.order': parentIdValid } },
    {
      $project: {
        _id: 0, 'provinces.districts.towns.order': 1, 'provinces.districts.towns.name': 1,
      },
    },

  ])
  .exec();


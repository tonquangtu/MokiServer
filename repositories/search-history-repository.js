const { SearchHistory } = global;

exports.getSearchHistoryById = searchId => SearchHistory.findById(searchId).exec();

exports.deleteSearchHistory = searchId => SearchHistory.findOneAndRemove(searchId).exec();

exports.saveSearchHistory = (searchHistoryData) => {
  const searchHistory = new SearchHistory(searchHistoryData);

  return searchHistory.save();
};

exports.getSearchHistoryList = (skip, count, userId) =>
  SearchHistory.find({ user: userId })
    .skip(skip)
    .limit(count)
    .populate({ path: 'category', select: 'name' })
    .populate({ path: 'brand', select: 'name' })
    .populate({ path: 'product_size', select: 'name' })
    .exec();

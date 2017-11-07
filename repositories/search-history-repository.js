const { SearchHistory } = global;

exports.getSearchHistoryById = searchId => SearchHistory.findById(searchId).exec();

exports.deleteSearchHistory = searchId => SearchHistory.findOneAndRemove(searchId).exec();

exports.saveSearchHistory = (searchHistoryData) => {
  const searchHistory = new SearchHistory(searchHistoryData);

  return searchHistory.save();
};

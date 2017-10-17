const searcher = require('../searches/elasticsearch');

const { constants, helpers } = global;

exports.simpleSearchProducts = (searchParams, callback) => {
  const {
    keyword,
    fromIndex,
    limit,
  } = searchParams;

  searcher.simpleSearchProducts(keyword, fromIndex, limit)
    .then((result) => {
      console.log(result);
      callback(result);
    }).catch((err) => {
      console.log(err);
    });
};

exports.searchProducts = (searchParams, callback) => {
  searcher.searchProducts(searchParams)
    .then((result) => {
      console.log(result);
      callback(result);
    }).catch((err) => {
      console.log(err);
    });
};

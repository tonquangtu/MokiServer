const elasticsearch = require('elasticsearch');

const { constants } = global;

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'info',
});

exports.ping = () => {
  client.ping({
    requestTimeout: 1000,
  }, (err) => {
    if (err) {
      console.log('Elasticsearch cluster is down');
    } else {
      console.log('All is well');
    }
  });
};

exports.simpleSearchProducts = (keyword, fromIndex, limit, selectFields) => {
  const searchQuery = {
    index: constants.dbName,
    type: constants.documents.product,
    from: fromIndex,
    size: limit,
    _source: selectFields,
    body: {
      query: { match: { name: keyword } },
    },
  };
  return client.search(searchQuery);
};

exports.searchProducts = (searchParams) => {
  const {
    fromIndex,
    limit,
    selectFields,
  } = searchParams;
  const query = getSearchQuery(searchParams);
  const searchQuery = {
    index: constants.dbName,
    type: constants.documents.product,
    from: fromIndex,
    size: limit,
    _source: selectFields,
    body: { query },
  };
  return client.search(searchQuery);
};

function getSearchQuery(searchParams) {
  const {
    keyword,
    categoryId,
    brandId,
    productSizeId,
    priceMin,
    priceMax,
    productCondition,
  } = searchParams;

  const filter = [];
  const must = {};
  if (keyword) {
    must.match = { name: keyword };
  } else {
    must.match_all = {};
  }

  if (categoryId) {
    filter.push({ term: { categories: categoryId } });
  }
  if (brandId) {
    filter.push({ term: { brands: brandId } });
  }
  if (productSizeId) {
    filter.push({ term: { sizes: productSizeId } });
  }
  if (productCondition) {
    filter.push({ term: { condition: productCondition } });
  }
  if (priceMin && priceMax) {
    filter.push({ range: { price: { gte: priceMin, lte: priceMax } } });
  }
  return {
    bool: {
      must,
      filter,
    },
  };
}

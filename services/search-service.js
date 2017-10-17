const likeRepo = require('../repositories/like-repository');
const searcher = require('../searches/elasticsearch');

const { constants } = global;

exports.searchProducts = (searchParams, callback) => {
  const selectFields = ['name', 'media', 'price', 'price_percent', 'like', 'comment'];
  const fullSearchParams = Object.assign({}, searchParams, { selectFields });
  const { userId } = fullSearchParams;
  let products = null;

  searcher
    .searchProducts(fullSearchParams)
    .then(esResponse => getProdsFromESResponse(esResponse))
    .then((items) => {
      products = items;
      if (!products || !userId) {
        return null;
      }
      const promisesCheckLiked = products.map(item => likeRepo.getLikeUserProduct(userId, item.id));
      return Promise.all(promisesCheckLiked);
    })
    .then((userLikes) => {
      let response;
      if (!products) {
        return callback(constants.response.searchNotFound);
      }

      if (!userLikes) {
        response = {
          code: constants.response.ok.code,
          message: constants.response.ok.message,
          data: products,
        };
      } else {
        let i = 0;
        const productsWithLike = products.map((product) => {
          const isLiked = userLikes[i] ? userLikes[i].is_liked : 0;
          const item = Object.assign({}, product, { isLiked });
          i += 1;
          return item;
        });
        response = {
          code: constants.response.ok.code,
          message: constants.response.ok.message,
          data: productsWithLike,
        };
      }
      return callback(response);
    })
    .catch((err) => {
      console.log(err);
      return callback(constants.response.systemError);
    });
};

function getProdsFromESResponse(esResponse) {
  if (!esResponse || !esResponse.hits || esResponse.hits.total < 1) {
    return null;
  }
  const { hits } = esResponse.hits;
  console.log(`Search take: ${esResponse.took}  ms`);

  return hits.map((item) => {
    let image = null;
    let video = null;
    const itemData = item._source;
    const { media } = itemData;

    if (media.urls.length > 0) {
      if (media.type === constants.product.media.type.image) {
        image = media.urls[0];
      } else {
        video = {
          thumb: media.thumb,
          url: media.urls[0],
        };
      }
    }

    return {
      id: item._id,
      name: itemData.name,
      image,
      video,
      price: itemData.price,
      pricePercent: itemData.pricePercent,
      like: itemData.like,
      comment: itemData.comment,
    };
  });
}

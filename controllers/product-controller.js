const constant = require('../constants/constants');

const Product = require('../models/product');
const User = require('../models/user');
const Like = require('../models/like');
const Block = require('../models/block');

exports.get_list_products = (req, res) => {
  const data = req.body;
  const user = User.find().where('token').equals(data.token).exec();
  if (!user) {
    return res.json({
      code: 9996,
      message: constant.response.c9996,
      data: [],
    })
  }
  const categoryId = data.category_id;
  const campaignId = data.campaign_id;
  const lastId = data.last_id;
  const index = data.index;
  const count = data.count;

  Product.find()
    .where('categories').equals(categoryId)
    .where('campaigns').equals(campaignId)
    .where('id').lt(lastId)
    .sort('-id')
    .limit(count)
    .exec((err, data) => {
      if (err) {
        return res.json({
          code: 9999,
          message: constant.response.c9999,
          data: [],
        });
      }
      if (data.length === 0) {
        return res.json({
          code: 9994,
          message: constant.response.c9994,
          data: [],
        });
      }
      const products = [];
      data.forEach((product) => {
        const isLiked = Like.find()
          .where('user').equals(user.id)
          .where('product').equals(product.id)
          .exec((err, data) => data.length !== 0);
        const isBlocked = Block.find()
          .where('user').equals(user.id)
          .where('product').equals(product.id)
          .exec((err, data) => data.length !== 0);
        let canEdit = false;

        const seller = User.find()
          .where('id').equals(product.seller).exec();

        if (product.banned === 0 || seller.id === user.id) {
          if (seller.id === user.id) {
            canEdit = true;
          }
          const oneProduct = {
            id: product.id,
            name: product.name,
            image: [],
            video: [],
            price: product.price,
            price_percent: product.price_percent,
            brand: product.brands,
            described: product.description,
            created: product.created_at,
            like: product.like,
            comment: product.comment,
            is_liked: isLiked,
            is_blocked: isBlocked,
            can_edit: canEdit,
            banned: product.banned,
            seller: {
              id: seller.id,
              username: seller.name,
              avatar: seller.avatar,
            },
          };
          if (product.media.type === constant.product.media.type.image) {
            product.media.urls.forEach((item) => {
              oneProduct.image.push({
                url: item,
              });
            });
          } else {
            product.media.urls.forEach((item) => {
              oneProduct.video.push({
                url: item[0],
                thumb: product.media.thumb,
              });
            });
          }

          products.push(oneProduct);
        }
      });
      const newItems = Product.find().where('id').gt(index).exec((err, data) => data.length);
      return res.json({
        code: 1000,
        message: constant.response.c1000,
        data: {
          products,
          new_items: newItems,
          last_id: products.slice(-1)[0].id,
        },
      });
    });
};
exports.add_product = (req, res) => {
  const data = req.body;
  const user = User.find().where('token').equals(data.token).exec();
  if (!user) {
    return res.json({
      code: 9996,
      message: constant.response.c9996,
      data: [],
    });
  }
  const name = data.name;
  const price = data.price;
  const productSizeId = data.product_size_id;
  const brandId = data.brand_id;
  const categoryId = data.category_id;
  const images = data.image;
  const video = data.video;
  const thumb = data.thumb;
  const described = data.described;
  const shipsFrom = data.ships_from;
  const shipsFromIds = data.ships_from_id;
  const condition = data.condition;
  const dimension = data.dimention;
  const weight = data.weight;

  let media = {};
  if (images.length > 0) {
    let listUrl = [];
    images.forEach((item) => {
      listUrl.push(saveImage(item))
    });

    media = {
      type: constant.product.media.type.image,
      urls: listUrl,
      thumb: '',
    }
  } else {
    let listUrl = [];
    listUrl.push(saveVideo(video));
    media = {
      type: constant.product.media.type.video,
      urls: listUrl,
      thumb: saveImage(thumb),
    }
  }

  let newProduct = new Product({
    name: name,
    media: media,
    seller: user.id,
    price: price,
    price_percent: 0,
    description: described,
    ships_from: shipsFrom,
    ships_from_ids: shipsFromIds,
    condition: condition,
    sizes: productSizeId,
    brands: brandId,
    categories: categoryId,
    url: {type: String, required: true},
    weight: weight,
    dimension: dimension,
    comments: [],
    campaigns: [],
  });
  newProduct.save((err, product) => {
    if (err) {
      return res.json({
        code: 9999,
        message: constant.response.c9999,
        data: [],
      });
    }
    return res.json({
      code: 1000,
      message: constant.response.c1000,
      data: {
        id: product.id,
        url: product.url,
      }
    });
  });

};

function saveImage(image) {
  let url = '';
  //To do
  return url;
}
function saveVideo(video) {
  let url = '';
  //To do
  return url;
}

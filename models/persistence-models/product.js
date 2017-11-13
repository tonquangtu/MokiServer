const { mongoose } = global;
const { Schema } = mongoose;

const ProductsSchema = new Schema({
  name: { type: String, required: true },
  media: {
    type: { type: Number, required: true },
    urls: [{ type: String, required: true }],
    thumb: { type: String },
  },
  seller: { type: Schema.ObjectId, ref: 'users', required: true },
  seller_username: { type: String },
  price: { type: Number, required: true },
  price_percent: { type: Number, required: true },
  description: { type: String, required: true, default: '' },
  ships_from: { type: String, required: true },
  ships_from_ids: [{ type: Number, required: true }],
  condition: { type: Number, required: true },
  like: { type: Number, required: true, default: 0 },
  comment: { type: Number, required: true, default: 0 },
  banned: { type: Number, required: true, default: 0 },
  sizes: [{ type: Schema.ObjectId, ref: 'sizes', required: true }],
  brands: [{ type: Schema.ObjectId, ref: 'brands', required: true }],
  categories: [{ type: Schema.ObjectId, ref: 'categories', required: true }],
  url: { type: String, required: true },
  weight: { type: String },
  dimension: {
    height: { type: Number },
    width: { type: Number },
    length: { type: Number },
  },
  comments: [
    {
      content: { type: String, required: true },
      commenter: { type: Schema.ObjectId, ref: 'users', required: true },
      is_blocked: { type: Number, required: true, default: 0 },
      created_at: { type: Date, required: true, default: Date.now },
    },
  ],
  campaigns: [{ type: Schema.ObjectId, ref: 'campaigns', required: true }],
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
  deleted_at: { type: Date, default: null },
});
module.exports = mongoose.model('products', ProductsSchema);

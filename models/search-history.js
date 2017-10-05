const { mongoose } = global;
const { Schema } = mongoose;

const SearchHistoriesSchema = new Schema({
  user: { type: Schema.ObjectId, ref: 'users', required: true },
  keyword: { type: String },
  category: { type: String },
  brand: { type: String },
  product_size: { type: String },
  price_min: { type: Number },
  price_max: { type: Number },
  condition: { type: Number },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
});
module.exports = mongoose.model('search_histories', SearchHistoriesSchema);

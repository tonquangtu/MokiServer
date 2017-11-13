const { mongoose } = global;
const { Schema } = mongoose;

const CategoriesSchema = new Schema({
  name: { type: String, required: true, unique: true },
  has_brand: { type: Number, required: true, default: 0 },
  has_name: { type: Number, required: true, default: 0 },
  parent: { type: Schema.ObjectId, ref: 'categories', default: null },
  has_child: { type: Number, required: true, default: 0 },
  has_size: { type: Number, required: true, default: 0 },
  created_at: { type: Date, required: true, default: Date.now },
  sizes: [{ type: Schema.ObjectId, ref: 'sizes', required: true }],
  brands: [{ type: Schema.ObjectId, ref: 'brands', required: true }],
});
module.exports = mongoose.model('categories', CategoriesSchema);

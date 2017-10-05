const { mongoose } = global;
const { Schema } = mongoose;

const CategoriesSchema = new Schema({
  name: { type: String, required: true, unique: true },
  has_brand: { type: Number, required: true, default: 0 },
  has_name: { type: String, required: true, default: 0 },
  parent: { type: String },
  has_child: { type: String, required: true, default: 0 },
  has_size: { type: String, required: true, default: 0 },
  created_at: { type: Date, required: true, default: Date.now },
});
module.exports = mongoose.model('categories', CategoriesSchema);

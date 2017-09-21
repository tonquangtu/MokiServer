const { mongoose } = global.mongoose;
const { Schema } = mongoose.Schema;

const BrandsSchema = new Schema({
  name: { type: String, required: true },
  created_at: { type: Date, required: true, default: Date.now },
});
module.exports = mongoose.model('brands', BrandsSchema);

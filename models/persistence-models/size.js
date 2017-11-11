const { mongoose } = global;
const { Schema } = mongoose;

const SizesSchema = new Schema({
  name: { type: String, required: true },
  created_at: { type: Date, required: true, default: Date.now },
});
module.exports = mongoose.model('sizes', SizesSchema);

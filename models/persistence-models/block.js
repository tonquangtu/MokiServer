const { mongoose } = global;
const { Schema } = mongoose;

const BlocksSchema = new Schema({
  user: { type: Schema.ObjectId, ref: 'users', required: true },
  product: { type: Schema.ObjectId, ref: 'products', required: true },
  is_blocked: { type: Number, required: true, default: 0 },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
});
module.exports = mongoose.model('blocks', BlocksSchema);

const { mongoose } = global.mongoose;
const { Schema } = mongoose.Schema;

const LikesSchema = new Schema({
  user: { type: Schema.ObjectId, ref: 'users', required: true },
  product: { type: Schema.ObjectId, ref: 'products', required: true },
  is_liked: { type: Number, required: true, default: 0 },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model('likes', LikesSchema);

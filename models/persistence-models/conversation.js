const { mongoose } = global;
const { Schema } = mongoose;

const ConversationsSchema = Schema({
  user: { type: Schema.ObjectId, ref: 'users', required: true },
  partner: { type: Schema.ObjectId, ref: 'users', required: true },
  product: { type: Schema.ObjectId, ref: 'products' },
  partner_role: {
    type: Number,
    required: true,
    default: 1,
    enum: [0, 1, 2],
  },
  last_message: {
    message: { type: String },
    created_at: { type: Date },
  },
  num_unread_message: {
    type: Number,
    required: true,
    default: 1,
    min: 0,
  },
  created_at: { type: Date, required: true, default: Date.now },
  deleted_at: { type: Date, default: null },
});

module.exports = mongoose.model('conversations', ConversationsSchema);

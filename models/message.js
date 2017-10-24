const { mongoose } = global;
const { Schema } = mongoose;

const MessagesSchema = new Schema({
  conversation: {
    type: Schema.ObjectId,
    ref: 'conversations',
    required: true,
    unique: true,
  },
  contents: [
    {
      message: { type: String, required: true },
      sender_type: { type: Number, required: true },
      unread: {
        type: Number,
        required: true,
        default: 1,
        enum: [0, 1],
      },
      created_at: { type: Date, required: true, default: Date.now },
      updated_at: { type: Date, required: true, default: Date.now },
      deleted_at: { type: Date, default: null },
    },
  ],
});

module.exports = mongoose.model('messages', MessagesSchema);

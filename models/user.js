const { mongoose } = global;
const { Schema } = mongoose;

const UsersSchema = new Schema({

  username: { type: String, required: true },
  hash_password: { type: String, required: true },
  phone_number: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  uuid: { type: String },
  token: { type: String, required: true },
  avatar: { type: String, required: true },
  role: { type: Number, required: true, enum: [0, 1] },
  active: { type: Number, required: true, enum: [0, 1] },
  url: { type: String, required: true },
  status: { type: Number, required: true, enum: [0, 1] },
  addresses: [
    {
      address: { type: String },
      city: { type: String },
    },
  ],
  default_address: { type: Schema.ObjectId },
  blocks: [
    {
      user: { type: Schema.ObjectId, ref: 'users', required: true },
      created_at: { type: Date, required: true, default: Date.now },
    },
  ],
  follows_to: [
    {
      user: { type: Schema.ObjectId, ref: 'users', required: true },
      created_at: { type: Date, required: true, default: Date.now },
    },
  ],
  follows_from: [
    {
      user: { type: Schema.ObjectId, ref: 'users', required: true },
      created_at: { type: Date, required: true, default: Date.now },
    },
  ],
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
  deleted_at: { type: Date, default: null },
});

module.exports = mongoose.model('users', UsersSchema);

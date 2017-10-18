const { mongoose } = global;
const { Schema } = mongoose;

const UserOrderAddressSchema = new Schema({
  user: {
    type: Schema.ObjectId, ref: 'users', required: true, unique: true,
  },
  order_address: {
    address: { type: String, required: true },
    addresses_id: [
      { type: Number },
    ],
    default: { type: String },
  },
});

module.exports = mongoose.model('user_order_address', UserOrderAddressSchema);

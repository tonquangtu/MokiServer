const { mongoose } = global;
const { Schema } = mongoose;

const UserOrderAddressSchema = new Schema({
  user: {
    type: Schema.ObjectId, ref: 'users', required: true, unique: true,
  },
  order_addresses: {
    address: { type: String, required: true },
    address_id: { type: Array, required: true },
    default: { type: String },
  },
});

module.exports = mongoose.model('user_order_address', UserOrderAddressSchema);

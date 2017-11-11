const { mongoose } = global;
const { Schema } = mongoose;

const Devices = new Schema({
  user: { type: String, required: true, ref: 'users' },
  device_type: { type: Number },
  device_id: { type: String },
  device_token: { type: String },
  expired_at: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

module.exports = mongoose.model('devices', Devices);

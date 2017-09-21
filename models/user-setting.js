const { mongoose } = global.mongoose;
const { Schema } = mongoose.Schema;

const UserSettingsSchema = new Schema({
  user: { type: Schema.ObjectId, ref: 'users', required: true },
  push_setting: {
    like: { type: Number, required: true, default: 1 },
    comment: { type: Number, required: true, default: 1 },
    announcement: { type: Number, required: true, default: 1 },
    sound_on: { type: Number, required: true, default: 1 },
    sound_off: { type: Number, required: true, default: 1 },
  },
});
module.exports = mongoose.model('user_settings', UserSettingsSchema);

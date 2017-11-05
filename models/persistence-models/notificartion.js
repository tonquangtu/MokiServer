const { mongoose } = global;
const { Schema } = mongoose;

const NotificationsSchema = new Schema({
  object: { type: Schema.ObjectId, required: true },
  object_type: { type: Number, required: true },
  title: { type: String, required: true },
  avatar: { type: String, required: true },
  group: { type: Number, required: true },
  created_at: { type: Date, required: true, default: Date.now },
});
module.exports = mongoose.model('notifications', NotificationsSchema);

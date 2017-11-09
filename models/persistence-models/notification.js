const { mongoose } = global;

const { Schema } = mongoose;

const NotificationsSchema = new Schema({
  user: { type: Schema.ObjectId, ref: 'users', required: true },
  badge: { type: String },
  contents: [{
    object_type: { type: Number },
    object_id: { type: Schema.ObjectId },
    title: { type: String },
    avatar: { type: String },
    group: { type: Number, enum: [0, 1] },
    read: { type: Number, enum: [0, 1] },
    created_at: { type: Date, default: Date.now },
  }],
});

module.exports = mongoose.model('notifications', NotificationsSchema);

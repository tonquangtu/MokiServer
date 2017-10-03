const { mongoose } = global;
const { Schema } = mongoose;

const ReportsSchema = new Schema({
  reporter: { type: Schema.ObjectId, ref: 'users', required: true },
  product: { type: Schema.ObjectId, ref: 'products', required: true },
  subject: { type: String, required: true },
  details: { type: String, required: true },
  created_at: { type: Date, required: true, default: Date.now },
});
module.exports = mongoose.model('reports', ReportsSchema);

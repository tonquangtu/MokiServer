const { mongoose } = global.mongoose;
const { Schema } = mongoose.Schema;

const CampaignsSchema = new Schema({
  name: { type: String, required: true },
  banner: { type: String, required: true },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
});
module.exports = mongoose.model('campaigns', CampaignsSchema);

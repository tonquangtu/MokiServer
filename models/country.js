const { mongoose } = global.mongoose;
const { Schema } = mongoose.Schema;

const CountrySchema = new Schema({
  provinces: [
    {
      order: { type: Number },
      name: { type: String, required: true },
      districts: [
        {
          order: { type: Number },
          name: { type: String, required: true },
          towns: [
            {
              order: { type: Number },
              name: { type: String, required: true },
            },
          ],
        },
      ],
    },
  ],
  created_at: { type: Date, required: true, default: Date.now },
});
module.exports = mongoose.model('country', CountrySchema);

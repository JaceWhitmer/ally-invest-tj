import { Schema, model, models } from "mongoose";

const entrySchema = new Schema({
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  ticker: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    require: true,
  },
  tradeDate: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
    default: "Self",
  },
});

// entrySchema.query();

const Entry = models.Entry || model("Entry", entrySchema);

export default Entry;

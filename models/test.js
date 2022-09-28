import { Schema, model, models } from "mongoose";

const testSchema = new Schema({
  date: String,
  comment: String,
});

const Test = models.Test || model("Test", testSchema);

export default Test;

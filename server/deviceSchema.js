import mongoose from "mongoose";
const temperature = new mongoose.Schema({
  id: { type: Number },
  logs: { type: String },
});

export const tempSchema = mongoose.model("temperature", temperature, "temperature");

import { Schema, model } from "mongoose";

const TemperaturesSchema = new Schema(
  {
    topic: String,
    value: Number,
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);
export default model("temps", TemperaturesSchema);

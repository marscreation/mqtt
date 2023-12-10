import { Schema, model } from "mongoose";

const DevicesSchema = new Schema(
  {
    userId: {type: Schema.Types.ObjectId, ref: 'Users'},
    device: String,
    topic: String,
    active: { type: Number, default: 1 },
  },
  { timestamps: true }
);
export default model("devices", DevicesSchema);

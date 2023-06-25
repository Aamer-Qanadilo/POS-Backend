import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    baseUnit: {
      type: String,
      required: true,
    },
    conversionFactor: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export const unitModel = mongoose.model("unit", unitSchema);

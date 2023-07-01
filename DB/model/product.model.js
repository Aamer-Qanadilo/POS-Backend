import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: Number,
    unitOfMeasure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "unit",
      required: true,
    },
  },
  { timestamps: true },
);

export const productModel = mongoose.model("product", productSchema);

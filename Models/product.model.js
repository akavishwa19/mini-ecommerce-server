import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    product_code: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price:{
        type:Number,
        default:0
    },
    stock:{
      type:Number,
      default:0
    }
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", schema);

export default Product;

import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User'
    },
    product_id: {
    type: mongoose.Schema.Types.ObjectId,
      ref:'Product'
    },
    quantity: {
      type: Number,
      default:1
    },
   
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", schema);

export default Cart;

import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    order_id:{
      type:String,
      unique:true,
      required:true
    },
    cart: {
      type: Array,
    },
    net_price: {
      type: Number,
      default: 1,
    },
    payment_status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    order_status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered"],
      default: "Pending",
    },
    shipping_address: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", schema);

export default Order;

import Order from "../Models/order.model.js";
import Cart from "../Models/cart.model.js";
import Product from "../Models/product.model.js";
import { SuccessResponse } from "../Utils/successResponse.js";
import { ErrorResponse } from "../Utils/errorrResponse.js";
import cryptoRandomString from "crypto-random-string";

const placeOrder = async (req, res) => {
  try {
    const user_id = await req.user_id;

    const currentCart = await Cart.find({
      user_id,
    }).populate("product_id");

    const stocked_out_products = [];

    //check product stocks
    for (let item of currentCart) {
      const product_stock = item.product_id.stock;

      if (item.quantity > product_stock) {
        stocked_out_products.push(item.product_id.name);
      }
    }

    if (stocked_out_products.length > 0) {
      return res
        .status(400)
        .json(
          new ErrorResponse(
            400,
            "following items went out of stock: " +
              stocked_out_products.join(" , ")
          )
        );
    }

    console.log(currentCart)

    req.body.cart = currentCart;

    //calculate total
    let total = 0;

    for (let item of currentCart) {
      let temp = item.product_id.price * item.quantity;
      total += temp;
    }

    const shipping_address = {
      country: req.body.country,
      state: req.body.state,
      city: req.body.state,
      pincode: req.body.pincode,
    };

    req.body.shipping_address = shipping_address;

    req.body.net_price = total;
    req.body.user_id = req.user_id;

    const code = cryptoRandomString({ length: 8, type: "alphanumeric" });
    req.body.order_id = code;

    const data = new Order(req.body);
    await data.save();

    //update stock
    for (let item of currentCart) {
      const value_change = item.quantity;

      await Product.findByIdAndUpdate(item.product_id._id, {
        $inc: {
          stock: -value_change,
        },
      });
    }

    //clear cart

    await Cart.deleteMany({
      user_id,
    });

    return res
      .status(200)
      .json(new SuccessResponse(200, null, "order placed succesfully"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ErrorResponse(500, error?.message));
  }
};

const fetchOrderBYUser = async (req, res) => {
  try {
    const user_id = req.user_id;

    const data = await Order.find({user_id}).sort({
      createdAt: -1,
    }).populate({
      path:"cart.product_id",
      model:"Product"
    })

    return res
      .status(200)
      .json(new SuccessResponse(200, data, "order placed succesfully"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ErrorResponse(500, error?.message));
  }
};

const fetchOrder = async (req, res) => {
  try {
    const data = await Order.find().sort({
      createdAt: -1,
    });

    return res
      .status(200)
      .json(new SuccessResponse(200, data, "order placed succesfully"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ErrorResponse(500, error?.message));
  }
};

const ssr = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const filter = req.query.filter || "";
    const sortField = req.query.sortField || "name";
    const sortOrder = req.query.sortOrder || "asc";

    let filterQuery = {};
    if (filter) {
      const regex = new RegExp(filter, "i");
      filterQuery = {
        name: { $regex: regex },
      };
    }

    const totalRecords = await Order.countDocuments(filterQuery);

    const sortOptions = {};
    sortOptions[sortField] = sortOrder === "desc" ? -1 : 1;

    const data = await Order.find(filterQuery)    
      .skip((page - 1) * size)
      .limit(size)
      .sort(sortOptions).
      populate("user_id");

    return res
      .status(200)
      .json(
        new SuccessResponse(200, { totalRecords, data }, "Fetched all responses")
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
};

export { placeOrder, fetchOrderBYUser, fetchOrder , ssr };

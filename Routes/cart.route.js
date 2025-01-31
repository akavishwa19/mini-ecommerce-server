import { Router } from "express";
import {
  clearCart,
  updateItemQuantity,
  removeFromCart,
  addToCart,
  fetchCart,
  bill
} from "../Controllers/cart.controller.js";

import { authVerify } from "../Middleware/auth.middleware.js";

const router = Router();

router.delete("/clear", authVerify, clearCart);
router.post("/update", authVerify, updateItemQuantity);
router.delete("/", authVerify, removeFromCart);
router.post("/", authVerify, addToCart);
router.get("/", authVerify, fetchCart);
router.get("/bill", authVerify, bill);

export default router;

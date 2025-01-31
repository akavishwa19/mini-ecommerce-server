import { Router } from "express";
import {
    placeOrder , fetchOrderBYUser , fetchOrder , ssr
} from "../Controllers/order.controller.js";

import { authVerify } from "../Middleware/auth.middleware.js";

const router = Router();

router.post("/", authVerify, placeOrder);
router.get("/by-user", authVerify, fetchOrderBYUser);
router.get("/", authVerify, fetchOrder);
router.get("/ssr", authVerify, ssr);

export default router;

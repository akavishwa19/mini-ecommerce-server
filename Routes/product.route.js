import { Router } from "express";
import { add, edit, remove, fetch , ssr , single } from "../Controllers/product.controller.js";

import { authVerify } from "../Middleware/auth.middleware.js";

const router = Router();

router.post("/", add);
router.put("/", edit);
router.get("/", fetch);
router.get("/single", single);
router.delete("/", remove);
router.get('/ssr',ssr);

export default router;

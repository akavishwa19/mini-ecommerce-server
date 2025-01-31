import { Router } from "express";
import { register, login, me , logout , isloggedIn} from "../Controllers/auth.controller.js";

import { authVerify } from "../Middleware/auth.middleware.js";
import { authCheck } from "../Middleware/authCheck.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", authVerify, me);
router.post("/logout", authVerify, logout);
router.get('/auth-check',authCheck,isloggedIn)

export default router;

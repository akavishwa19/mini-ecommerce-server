import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import "dotenv/config";

import { connectDb } from "./Services/connectdb.js";

const app = express();
app.use(express.json())
app.use(
  cors({
    origin: [
      "http://localhost:4500",
      "http://localhost:4200",
      "https://mini-ecommerce-2urr5rips-akavishwa19s-projects.vercel.app",
      "http://mini-ecommerce-2urr5rips-akavishwa19s-projects.vercel.app",
      "https://mini-ecommerce-iota.vercel.app",
       "http://mini-ecommerce-iota.vercel.app"
    ],
    credentials: true,
  })
);
app.use(cookieParser());

connectDb();

//health
app.get("/", async (req, res) => {
  try {
    return res.status(200).send("health api works fine");
  } catch (error) {
    console.log(error.message);
  }
});

//routes
import uploadRouter from "./Routes/upload.route.js";
import authRouter from "./Routes/auth.route.js";
import productRouter from "./Routes/product.route.js";
import cartRouter from "./Routes/cart.route.js";
import orderRouter from "./Routes/order.route.js";

app.use("/api/v1/upload", uploadRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);



const port = process.env.PORT;

app.listen(port, () => {
  console.log("server started on http://localhost:" + port);
});

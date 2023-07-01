import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./DB/connection.js";
import * as allRouter from "./module/index.router.js";
import { auth } from "./middleware/auth.js";
const app = express();

app.use(cors());
const port = process.env.PORT || 3000;
app.use(express.json());
const baseUrl = process.env.BASEURL;

app.use(`${baseUrl}/uploads`, express.static("./uploads"));
app.use(`${baseUrl}/auth`, allRouter.authRouter);
app.use(`${baseUrl}/verifyToken`, auth(), (req, res) =>
  res.status(201).json({ message: "success" }),
);
app.use(`${baseUrl}/product`, auth(), allRouter.productRouter);
app.use(`${baseUrl}/category`, auth(), allRouter.categoryRouter);
app.use(`${baseUrl}/units`, auth(), allRouter.unitRouter);
app.use(`${baseUrl}/cart`, auth(), allRouter.cartRouter);

app.use("*", (req, res) => {
  res.json({ message: "invalid endpoint" });
});

connectDB();
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

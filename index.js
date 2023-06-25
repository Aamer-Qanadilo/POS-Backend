import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./DB/connection.js";
import * as allRouter from "./module/index.router.js";
const app = express();

app.use(cors());
const port = process.env.PORT || 3000;
app.use(express.json());
const baseUrl = process.env.BASEURL;

app.use(`${baseUrl}/uploads`, express.static("./uploads"));
app.use(`${baseUrl}/auth`, allRouter.authRouter);
app.use(`${baseUrl}/product`, allRouter.productRouter);
app.use(`${baseUrl}/category`, allRouter.categoryRouter);
app.use(`${baseUrl}/units`, allRouter.unitRouter);

app.use("*", (req, res) => {
  res.json({ message: "invalid endpoint" });
});

connectDB();
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

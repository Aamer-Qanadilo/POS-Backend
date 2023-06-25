import axios from "axios";
import { removeImage } from "../../service/multer.js";

const validateCategory = async (req, res, next) => {
  const { category } = req.body;

  const baseUrl = process.env.BASEURL;

  const categoryUrl =
    req.protocol + "://" + req.get("host") + baseUrl + "/category/";

  // console.log(productsUrl);
  // console.log(id);

  try {
    const { data } = await axios.get(categoryUrl + category);

    if (data.message === "success") {
      next();
    } else {
      if (req.file) removeImage("products", req.file.filename);

      res.status(404).json({ message: "invalid category id" });
    }
  } catch (error) {
    if (req.file) removeImage("products", req.file.filename);

    res.status(500).json({
      message: "something went wrong, please check your inputs",
      error,
    });
  }
};

const validateUnit = async (req, res, next) => {
  const { unitOfMeasure } = req.body;

  const baseUrl = process.env.BASEURL;

  const unitUrl = req.protocol + "://" + req.get("host") + baseUrl + "/units/";

  // console.log(productsUrl);
  // console.log(id);

  try {
    const { data } = await axios.get(unitUrl + unitOfMeasure);

    if (data.message === "success") {
      next();
    } else {
      if (req.file) removeImage("products", req.file.filename);

      res.status(404).json({ message: "invalid unit id" });
    }
  } catch (error) {
    if (req.file) removeImage("products", req.file.filename);

    res.status(500).json({
      message: "something went wrong, please check your inputs",
      error,
    });
  }
};

export default { validateCategory, validateUnit };

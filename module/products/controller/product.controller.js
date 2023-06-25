import { productModel } from "../../../DB/model/product.model.js";
import { removeImage } from "../../../service/multer.js";

const getAllProducts = async (req, res) => {
  const products = await productModel.find({});

  const baseUrl = process.env.BASEURL;

  const productUrl =
    req.protocol + "://" + req.get("host") + baseUrl + "/uploads/products/";

  if (products) {
    res
      .status(200)
      .json({ message: "success", imageBaseUrl: productUrl, data: products });
  } else {
    res.status(404).json({ message: "not found" });
  }
};

const getAllProductsByUnit = async (req, res) => {
  const { unitId } = req.params;

  try {
    const products = await productModel.find({ unitOfMeasure: unitId });

    if (products.length) {
      return res.status(201).json({ message: "success", data: products });
    } else {
      return res
        .status(404)
        .json({ message: "no products related to this id" });
    }
  } catch (error) {
    res.status(500).json({
      message: "something went wrong, please check your inputs",
      error,
    });
  }
};

const getAllProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const products = await productModel.find({ category: categoryId });

    if (products.length) {
      return res.status(201).json({ message: "success", data: products });
    } else {
      return res
        .status(404)
        .json({ message: "no products related to this id" });
    }
  } catch (error) {
    res.status(500).json({
      message: "something went wrong, please check your inputs",
      error,
    });
  }
};

const addProduct = async (req, res) => {
  let { name, code, category, price, unitOfMeasure } = req.body;

  const baseUrl = process.env.BASEURL;

  price = Number(price);
  if (isNaN(price)) {
    res.json({ message: "invalid inputs" });
    return;
  }

  const productUrl =
    req.protocol + "://" + req.get("host") + baseUrl + "/uploads/products/";

  const product = new productModel({
    name,
    category,
    code,
    unitOfMeasure,
    price,
    image: req.file.filename,
  });

  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Product added successfully!",
        userCreated: {
          _id: result._id,
          profileImg: productUrl + result.image,
        },
      });
    })
    .catch((err) => {
      console.log(req.body, price);
      console.log(err);
      res.status(500).json({
        message: "something went wrong, please check your inputs",
        error: err,
      });
    });
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  let { name, code, category, price, unitOfMeasure } = req.body;

  const baseUrl = process.env.BASEURL;

  const productUrl =
    req.protocol + "://" + req.get("host") + baseUrl + "/uploads/categories/";

  try {
    let product = await productModel.findOne({ _id: id });

    if (product) {
      //product exists
      const oldImageName = product.image;

      await productModel.findOneAndUpdate(
        { _id: id },
        {
          name,
          image: req.file.filename,
          code,
          category,
          price,
          unitOfMeasure,
        },
      );

      removeImage("products", oldImageName);

      return res.status(201).json({
        message: "success",
        data: {
          _id: product._id,
          name,
          code,
          category,
          price,
          unitOfMeasure,
          image: productUrl + req.file.filename,
        },
      });
    } else {
      //no product for user, create new product
      return res.status(404).json({ message: "invalid product" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "something went wrong, please check your inputs" });
  }
};

export default {
  getAllProducts,
  getAllProductsByUnit,
  getAllProductsByCategory,
  addProduct,
  updateProduct,
};
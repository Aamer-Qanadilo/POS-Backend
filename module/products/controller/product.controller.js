import { productModel } from "../../../DB/model/product.model.js";
import { removeImage } from "../../../service/multer.js";

const getAllProducts = async (req, res) => {
  const products = await productModel.find({});

  if (products) {
    const baseUrl = process.env.BASEURL;

    const productUrl =
      req.protocol + "://" + req.get("host") + baseUrl + "/uploads/products/";

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
      const baseUrl = process.env.BASEURL;

      const productUrl =
        req.protocol + "://" + req.get("host") + baseUrl + "/uploads/products/";

      return res
        .status(201)
        .json({ message: "success", imageBaseUrl: productUrl, data: products });
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
      const baseUrl = process.env.BASEURL;

      const productUrl =
        req.protocol + "://" + req.get("host") + baseUrl + "/uploads/products/";

      return res
        .status(201)
        .json({ message: "success", imageBaseUrl: productUrl, data: products });
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

  price = Number(price);
  if (isNaN(price)) {
    res.json({ message: "invalid inputs" });
    return;
  }

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
      const baseUrl = process.env.BASEURL;

      const productUrl =
        req.protocol + "://" + req.get("host") + baseUrl + "/uploads/products/";

      res.status(201).json({
        message: "Product added successfully!",
        userCreated: {
          _id: result._id,
          name,
          category,
          code,
          unitOfMeasure,
          price,
          image: productUrl + result.image,
        },
      });
    })
    .catch((err) => {
      if (req.file) removeImage("products", req.file.filename);

      res.status(500).json({
        message: "something went wrong, please check your inputs",
        error: err,
      });
    });
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  let { name, code, category, price, unitOfMeasure } = req.body;

  try {
    let product = await productModel.findOne({ _id: id });

    if (product) {
      //product exists
      const oldImageName = product.image;

      if (req.file) {
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
      } else {
        await productModel.findOneAndUpdate(
          { _id: id },
          {
            name,
            code,
            category,
            price,
            unitOfMeasure,
          },
        );
      }

      const baseUrl = process.env.BASEURL;

      const productUrl =
        req.protocol + "://" + req.get("host") + baseUrl + "/uploads/products/";

      return res.status(201).json({
        message: "success",
        data: {
          _id: product._id,
          name,
          code,
          category,
          price,
          unitOfMeasure,
          image: productUrl + (req.file ? req.file.filename : oldImageName),
        },
      });
    } else {
      if (req.file) removeImage("products", req.file.filename);

      //no product for user, create new product
      return res.status(404).json({ message: "invalid product" });
    }
  } catch (err) {
    if (req.file) removeImage("products", req.file.filename);

    res
      .status(500)
      .json({ message: "something went wrong, please check your inputs" });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    let product = await productModel.findOne({ _id: id });

    if (product) {
      await productModel.findOneAndDelete({ _id: id });

      removeImage("products", product.image);

      res.status(201).json({ message: "success", data: product });
    } else {
      //no product for user, create new product
      return res.status(404).json({ message: "invalid product" });
    }
  } catch (error) {
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
  deleteProduct,
};

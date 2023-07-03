import axios from "axios";
import { productModel } from "../../../DB/model/product.model.js";
import { removeImage } from "../../../service/multer.js";

const getAllProducts = async (req, res) => {
  const products = await productModel
    .find({})
    .populate(["category", "unitOfMeasure"]);

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

const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    console.log(id);

    const product = await productModel
      .findById(id)
      .populate(["category", "unitOfMeasure"]);

    // console.log(product);

    if (product) {
      const baseUrl = process.env.BASEURL;

      const productUrl =
        req.protocol + "://" + req.get("host") + baseUrl + "/uploads/products/";

      res
        .status(201)
        .json({ message: "success", imageBaseUrl: productUrl, data: product });
    } else {
      res.status(404).json({ message: "invalid product id" });
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

const getAllProductsByUnit = async (req, res) => {
  const { unitId } = req.params;

  try {
    const products = await productModel
      .find({ unitOfMeasure: unitId })
      .populate(["category", "unitOfMeasure"]);

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
    const products = await productModel
      .find({ category: categoryId })
      .populate(["category", "unitOfMeasure"]);

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

  const checkProduct = await productModel.findOne({ name, code });

  if (checkProduct) {
    return res.json({
      message: "failed",
      error: "this product already exists",
    });
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
    .then(async (result) => {
      const baseUrl = process.env.BASEURL;

      await result.populate(["category", "unitOfMeasure"]);

      const productUrl =
        req.protocol + "://" + req.get("host") + baseUrl + "/uploads/products/";

      res.status(201).json({
        message: "success",
        imageBaseUrl: productUrl,
        data: {
          _id: result._id,
          name,
          category: result.category,
          code,
          unitOfMeasure: result.unitOfMeasure,
          price,
          image: result.image,
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

      // This is used to delete the product from all of the active carts
      try {
        const baseUrl = process.env.BASEURL;

        const cartsUrl =
          req.protocol + "://" + req.get("host") + baseUrl + "/cart/product/";

        const { data } = await axios.delete(cartsUrl + id, {
          headers: {
            authorization:
              "foothill__eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OTg5NmU0NzRkMWNlMGU4NDFhOTJlMiIsImlzTG9nZ2VkSW4iOnRydWUsImlhdCI6MTY4Nzc2NzIyNH0.SdrohllCDZfCcQy_pg2n0oALHtvd2z7UUxOI1rKNDLs",
          },
        });
      } catch (error) {
        // Do nothing
      }

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
  getProduct,
};

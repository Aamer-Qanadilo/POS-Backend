import axios from "axios";
import { categoryModel } from "../../../DB/model/category.model.js";
import { removeImage } from "../../../service/multer.js";

const getAllCategories = async (req, res) => {
  const categories = await categoryModel.find({});

  const baseUrl = process.env.BASEURL;

  const categoryUrl =
    req.protocol + "://" + req.get("host") + baseUrl + "/uploads/categories/";

  if (categories) {
    res.status(200).json({
      message: "success",
      imageBaseUrl: categoryUrl,
      data: categories,
    });
  } else {
    res.status(404).json({ message: "not found" });
  }
};

const getCategory = async (req, res) => {
  const { id } = req.params;

  const baseUrl = process.env.BASEURL;

  const categoryUrl =
    req.protocol + "://" + req.get("host") + baseUrl + "/uploads/categories/";

  try {
    const category = await categoryModel.findById(id);

    if (category) {
      return res
        .status(201)
        .json({
          message: "success",
          imageBaseUrl: categoryUrl,
          data: category,
        });
    } else {
      return res.status(404).json({ message: "category not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "something went wrong, please check your inputs" });
  }
};

const addCategory = async (req, res) => {
  let { name } = req.body;

  const baseUrl = process.env.BASEURL;

  const categoryUrl =
    req.protocol + "://" + req.get("host") + baseUrl + "/uploads/categories/";

  const newCategory = new categoryModel({
    name,
    image: req.file.filename,
  });

  newCategory
    .save()
    .then((result) => {
      res.status(201).json({
        message: "success",
        data: {
          _id: result._id,
          name,
          image: categoryUrl + result.image,
        },
      });
    })
    .catch((err) => {
      console.log(req.body, price);
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

const updateCategory = async (req, res) => {
  let { id, name } = req.body;

  const baseUrl = process.env.BASEURL;

  const categoryUrl =
    req.protocol + "://" + req.get("host") + baseUrl + "/uploads/categories/";

  try {
    let category = await categoryModel.findOne({ _id: id });

    if (category) {
      //category exists
      const oldImageName = category.image;

      await categoryModel.findOneAndUpdate(
        { _id: id },
        { name, image: req.file.filename },
      );

      removeImage("categories", oldImageName);

      return res.status(201).json({
        message: "success",
        data: {
          _id: category._id,
          name,
          image: categoryUrl + req.file.filename,
        },
      });
    } else {
      //no category for user, create new category
      return res.status(404).json({ message: "invalid category" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "something went wrong, please check your inputs" });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  const baseUrl = process.env.BASEURL;

  const productsUrl =
    req.protocol +
    "://" +
    req.get("host") +
    baseUrl +
    "/product/getByCategory/";

  // console.log(productsUrl);
  // console.log(id);

  try {
    const { data } = await axios.get(productsUrl + id);

    if (data.message === "success") {
      return res.json({
        message: "failed",
        error: "can't delete, category is used by products",
      });
    }
  } catch (error) {
    // Do nothing, this means that the entered unit id isn't related to any product
  }

  try {
    let category = await categoryModel.findOne({ _id: id });

    if (category) {
      await categoryModel.findOneAndDelete({ _id: id });

      removeImage("categories", category.image);

      res.status(201).json({ message: "success" });
    } else {
      //no category for user, create new category
      return res.status(404).json({ message: "invalid category" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "something went wrong, please check your inputs" });
  }
};

export default {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getCategory,
};

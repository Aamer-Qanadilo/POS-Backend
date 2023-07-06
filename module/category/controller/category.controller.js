import axios from "axios";
import { categoryModel } from "../../../DB/model/category.model.js";
import { removeImage } from "../../../service/multer.js";

const getAllCategories = async (req, res) => {
  const categories = await categoryModel.find({});

  if (categories) {
    const baseUrl = process.env.BASEURL;

    const categoryUrl =
      req.protocol + "://" + req.get("host") + baseUrl + "/uploads/categories/";

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

  try {
    const category = await categoryModel.findById(id);

    if (category) {
      const baseUrl = process.env.BASEURL;

      const categoryUrl =
        req.protocol +
        "://" +
        req.get("host") +
        baseUrl +
        "/uploads/categories/";

      return res.status(201).json({
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

  const newCategory = new categoryModel({
    name,
    image: req.file.filename,
  });

  newCategory
    .save()
    .then((result) => {
      const baseUrl = process.env.BASEURL;

      const categoryUrl =
        req.protocol +
        "://" +
        req.get("host") +
        baseUrl +
        "/uploads/categories/";

      res.status(201).json({
        message: "success",
        imageBaseUrl: categoryUrl,
        data: result,
      });
    })
    .catch((err) => {
      console.log(req.body, price);
      console.log(err);
      res.status(500).json({
        message: "something went wrong",
        error: err,
      });
    });
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  let { name } = req.body;

  try {
    let category = await categoryModel.findOne({ _id: id });

    if (category) {
      //category exists
      const oldImageName = category.image;

      let result;
      if (req.file) {
        result = await categoryModel.findOneAndUpdate(
          { _id: id },
          { name, image: req.file.filename },
          { new: true },
        );

        removeImage("categories", oldImageName);
      } else {
        result = await categoryModel.findOneAndUpdate(
          { _id: id },
          { name },
          { new: true },
        );
      }

      const baseUrl = process.env.BASEURL;

      const categoryUrl =
        req.protocol +
        "://" +
        req.get("host") +
        baseUrl +
        "/uploads/categories/";

      return res.status(201).json({
        message: "success",
        imageBaseUrl: categoryUrl,
        data: result,
      });
    } else {
      if (req.file) removeImage("categories", req.file.filename);

      //no category for user, create new category
      return res.status(404).json({ message: "invalid category" });
    }
  } catch (err) {
    if (req.file) removeImage("categories", req.file.filename);

    console.log(err);
    res
      .status(500)
      .json({ message: "something went wrong, please check your inputs" });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const baseUrl = process.env.BASEURL;

    const productsUrl =
      req.protocol +
      "://" +
      req.get("host") +
      baseUrl +
      "/product/getByCategory/";

    const { data } = await axios.get(productsUrl + id, {
      headers: {
        authorization:
          "foothill__eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OTg5NmU0NzRkMWNlMGU4NDFhOTJlMiIsImlzTG9nZ2VkSW4iOnRydWUsImlhdCI6MTY4Nzc2NzIyNH0.SdrohllCDZfCcQy_pg2n0oALHtvd2z7UUxOI1rKNDLs",
      },
    });

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

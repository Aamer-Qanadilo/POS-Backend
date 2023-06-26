import axios from "axios";
import { removeImage } from "../../service/multer.js";

const validateCategory = async (req, res, next) => {
  const { category } = req.body;

  try {
    const baseUrl = process.env.BASEURL;

    const categoryUrl =
      req.protocol + "://" + req.get("host") + baseUrl + "/category/";

    const { data } = await axios.get(categoryUrl + category, {
      headers: {
        authorization:
          "foothill__eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OTg5NmU0NzRkMWNlMGU4NDFhOTJlMiIsImlzTG9nZ2VkSW4iOnRydWUsImlhdCI6MTY4Nzc2NzIyNH0.SdrohllCDZfCcQy_pg2n0oALHtvd2z7UUxOI1rKNDLs",
      },
    });

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

  try {
    const baseUrl = process.env.BASEURL;

    const unitUrl =
      req.protocol + "://" + req.get("host") + baseUrl + "/units/";

    const { data } = await axios.get(unitUrl + unitOfMeasure, {
      headers: {
        authorization:
          "foothill__eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OTg5NmU0NzRkMWNlMGU4NDFhOTJlMiIsImlzTG9nZ2VkSW4iOnRydWUsImlhdCI6MTY4Nzc2NzIyNH0.SdrohllCDZfCcQy_pg2n0oALHtvd2z7UUxOI1rKNDLs",
      },
    });

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

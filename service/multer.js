import multer from "multer";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const DetectError = (err, req, res, next) => {
  if (err) {
    res.status(400).json({ message: "multer error", err });
  } else {
    next();
  }
};

export const validationTypes = {
  image: ["image/jpeg", "image/png", "image/jpg"],
  pdf: ["application/pdf"],
};

export function myMulter(customPath, customValidation) {
  console.log(customPath);
  if (!customPath) {
    customPath = "genaral";
  }

  const fullPath = path.join(__dirname, `../uploads/${customPath}`);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath);
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `uploads/${customPath}`);
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.toLowerCase().split(" ").join("-");

      cb(null, nanoid() + Date.now() + "_" + fileName);
    },
  });
  function fileFilter(req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb("invalid image format", false);
      return cb(new Error("Only image format allowed!"));
    }
  }
  const upload = multer({ dest: fullPath, fileFilter, storage });
  return upload;
}

export const removeImage = (customPath, fileName) => {
  const fullPath = path.join(__dirname, `../uploads/${customPath}/${fileName}`);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath);
  }

  // const directoryPath = __basedir + "/resources/static/assets/uploads/";

  console.log(fullPath);

  fs.unlink(fullPath, (err) => {
    if (err) {
      return new Error("Could not delete the file. " + err);
    }

    console.log("File is deleted.");
  });
};

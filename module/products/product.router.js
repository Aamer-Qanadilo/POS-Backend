import { Router } from "express";
import {
  DetectError,
  myMulter,
  validationTypes,
} from "../../service/multer.js";
import productController from "./controller/product.controller.js";
import product_refValidator from "./product_ref.validator.js";

const router = Router();

router.get("", productController.getAllProducts);

router.get("/getByUnit/:unitId", productController.getAllProductsByUnit);

router.get(
  "/getByCategory/:categoryId",
  productController.getAllProductsByCategory,
);

router.post(
  "",
  product_refValidator.validateCategory,
  product_refValidator.validateUnit,
  myMulter("products", validationTypes.image).single("image"),
  DetectError,
  productController.addProduct,
);

router.patch(
  "/:id",
  product_refValidator.validateCategory,
  product_refValidator.validateUnit,
  myMulter("products", validationTypes.image).single("image"),
  DetectError,
  productController.updateProduct,
);

export default router;

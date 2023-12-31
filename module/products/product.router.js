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

router.get("/:id", productController.getProduct);

router.get("/getByUnit/:unitId", productController.getAllProductsByUnit);

router.get(
  "/getByCategory/:categoryId",
  productController.getAllProductsByCategory,
);

router.post(
  "",
  myMulter("products", validationTypes.image).single("image"),
  DetectError,
  product_refValidator.validateCategory,
  product_refValidator.validateUnit,
  productController.addProduct,
);

router.patch(
  "/:id",
  myMulter("products", validationTypes.image).single("image"),
  DetectError,
  product_refValidator.validateCategory,
  product_refValidator.validateUnit,
  productController.updateProduct,
);

router.delete("/:id", productController.deleteProduct);

export default router;

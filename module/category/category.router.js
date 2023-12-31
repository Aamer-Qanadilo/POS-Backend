import { Router } from "express";
import categoryController from "./controller/category.controller.js";
import {
  DetectError,
  myMulter,
  validationTypes,
} from "../../service/multer.js";

const router = Router();

// Get all categories
router.get("", categoryController.getAllCategories);

// Get custom category
router.get("/:id", categoryController.getCategory);

// Add a new category
router.post(
  "",
  myMulter("categories", validationTypes.image).single("image"),
  DetectError,
  categoryController.addCategory,
);

// Update an existing category
router.patch(
  "/:id",
  myMulter("categories", validationTypes.image).single("image"),
  DetectError,
  categoryController.updateCategory,
);

// Delete a category
router.delete("/:id", categoryController.deleteCategory);

export default router;

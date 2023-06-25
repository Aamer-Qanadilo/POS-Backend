import { Router } from "express";
import unitController from "./controller/unit.controller.js";

const router = Router();

router.get("", unitController.getAllUnits);

// Add a new category
router.post("", unitController.addUnit);

// Update an existing category
router.patch("", unitController.updateUnit);

// Delete a category
router.delete("/:id", unitController.deleteUnit);

export default router;

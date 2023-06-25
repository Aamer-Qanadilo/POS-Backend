import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import {
  signin,
  signup,
  verifyEmail,
  refreshToken,
  sendCode,
  forgetPassword,
  allUsers,
} from "./controller/auth.controller.js";
import * as validators from "./auth.validators.js";

const router = Router();

router.post("/signup", validation(validators.signup), signup);
router.post("/signin", validation(validators.signin), signin);
router.get("/allUsers", allUsers);
router.get("/verify/:token", verifyEmail);
router.get("/requestEmailToken/:token", refreshToken);
router.patch("/sendCode", sendCode);
router.patch("/forget-password", forgetPassword);

export default router;

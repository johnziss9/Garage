import express from "express";
import AuthenticationController from "./authentication.controller.js";

const router = express.Router();

router.route("/register").post(AuthenticationController.apiRegisterUser);
router.route("/login").post(AuthenticationController.apiLoginUser);

export default router;

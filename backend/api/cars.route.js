import express from "express";
import CarsController from "./cars.controller.js";

const router = express.Router();

router.route("/").get(CarsController.apiGetCars);

export default router;

import express from "express";
import RentalsController from "./rentals.controller.js";

const router = express.Router();

router.route("/getAll").get(RentalsController.apiGetRentals);

export default router;

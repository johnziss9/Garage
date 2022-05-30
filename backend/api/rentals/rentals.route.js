import express from "express";
import RentalsController from "./rentals.controller.js";

const router = express.Router();

router.route("/add").post(RentalsController.apiAddRental);

export default router;

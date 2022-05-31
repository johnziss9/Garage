import express from "express";
import RentalsController from "./rentals.controller.js";

const router = express.Router();

router.route("/add").post(RentalsController.apiAddRental);
router.route("/getAll").get(RentalsController.apiGetRentals);
router.route("/getPast").get(RentalsController.apiGetPastRentals);
router.route("/getFuture").get(RentalsController.apiGetFutureRentals);
router.route("/getCurrent").get(RentalsController.apiGetCurrentRentals);
router.route("/update").put(RentalsController.apiUpdateRental);

export default router;

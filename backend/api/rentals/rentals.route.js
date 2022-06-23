import express from "express";
import RentalsController from "./rentals.controller.js";
import verifyToken from "../authentication/authentication.js";

const router = express.Router();

router.route("/add").post(verifyToken, RentalsController.apiAddRental);
router.route("/getAll").get(verifyToken, RentalsController.apiGetRentals);
router.route("/getPast").get(verifyToken, RentalsController.apiGetPastRentals);
router.route("/getFuture").get(verifyToken, RentalsController.apiGetFutureRentals);
router.route("/getCurrent").get(verifyToken, RentalsController.apiGetCurrentRentals);
router.route("/update").put(verifyToken, RentalsController.apiUpdateRental);
router.route("/updateDates").put(verifyToken, RentalsController.apiUpdateRentalDates);
router.route("/delete").put(verifyToken, RentalsController.apiDeleteRental);

export default router;

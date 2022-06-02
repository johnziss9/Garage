import express from "express";
import RepairsController from "./repairs.controller.js";

const router = express.Router();

router.route("/add").post(RepairsController.apiAddRepair);
// router.route("/getAll").get(RentalsController.apiGetRentals);
// router.route("/getPast").get(RentalsController.apiGetPastRentals);
// router.route("/getFuture").get(RentalsController.apiGetFutureRentals);
// router.route("/getCurrent").get(RentalsController.apiGetCurrentRentals);
// router.route("/update").put(RentalsController.apiUpdateRental);
// router.route("/delete").put(RentalsController.apiDeleteRental);

export default router;

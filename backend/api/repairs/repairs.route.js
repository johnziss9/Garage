import express from "express";
import RepairsController from "./repairs.controller.js";

const router = express.Router();

router.route("/add").post(RepairsController.apiAddRepair);
router.route("/getAll").get(RepairsController.apiGetRepairs);
router.route("/getPast").get(RepairsController.apiGetPastRepairs);
router.route("/getFuture").get(RepairsController.apiGetFutureRepairs);
router.route("/getCurrent").get(RepairsController.apiGetCurrentRepairs);
// router.route("/update").put(RentalsController.apiUpdateRental);
router.route("/delete").put(RepairsController.apiDeleteRepair);

export default router;

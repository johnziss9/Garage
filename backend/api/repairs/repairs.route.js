import express from "express";
import RepairsController from "./repairs.controller.js";
import verifyToken from "../authentication/authentication.js";

const router = express.Router();

router.route("/add").post(verifyToken, RepairsController.apiAddRepair);
router.route("/getAll").get(verifyToken, RepairsController.apiGetRepairs);
router.route("/getPast").get(verifyToken, RepairsController.apiGetPastRepairs);
router.route("/getFuture").get(verifyToken, RepairsController.apiGetFutureRepairs);
router.route("/getCurrent").get(verifyToken, RepairsController.apiGetCurrentRepairs);
router.route("/update").put(verifyToken, RepairsController.apiUpdateRepair);
router.route("/delete").put(verifyToken, RepairsController.apiDeleteRepair);

export default router;

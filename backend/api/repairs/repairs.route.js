import express from "express";
import RepairsController from "./repairs.controller.js";
import verifyToken from "../authentication/authentication.js";

const router = express.Router();

router.route("/add").post(verifyToken, RepairsController.apiAddRepair);
router.route("/getAll").get(verifyToken, RepairsController.apiGetRepairs);
router.route("/getPast").get(verifyToken, RepairsController.apiGetPastRepairs);
router.route("/getFuture").get(verifyToken, RepairsController.apiGetFutureRepairs);
router.route("/getCurrent").get(verifyToken, RepairsController.apiGetCurrentRepairs);
router.route("/updateCustomerDetails").put(verifyToken, RepairsController.apiUpdateCustomerDetails);
router.route("/updateInsuranceDetails").put(verifyToken, RepairsController.apiUpdateInsuranceDetails);
router.route("/updateDates").put(verifyToken, RepairsController.apiUpdateDates);
router.route("/updateAlignments").put(verifyToken, RepairsController.apiUpdateAlignments);
router.route("/updatePaintings").put(verifyToken, RepairsController.apiUpdatePaintings);
router.route("/updateMechanical").put(verifyToken, RepairsController.apiUpdateMechanical);
router.route("/updateElectrical").put(verifyToken, RepairsController.apiUpdateElectrical);
router.route("/updateAirCondition").put(verifyToken, RepairsController.apiUpdateAirCondition);
router.route("/updateAdditionalWork").put(verifyToken, RepairsController.apiUpdateAdditionalWork);
router.route("/delete").put(verifyToken, RepairsController.apiDeleteRepair);

export default router;

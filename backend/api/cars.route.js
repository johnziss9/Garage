import express from "express";
import CarsController from "./cars.controller.js";

const router = express.Router();

router.route("/getAll").get(CarsController.apiGetCars);
router.route("/getExpiringMOTs").get(CarsController.apiGetExpiringMOTs);
router.route("/getExpiringRTs").get(CarsController.apiGetExpiringRTs);
router.route("/updateMOT").put(CarsController.apiUpdateMOT);
router.route("/updateRT").put(CarsController.apiUpdateRT);
router.route("/id/:id").get(CarsController.apiGetCarById);

export default router;

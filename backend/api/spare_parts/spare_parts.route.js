import express from "express";
import SparePartsController from "./spare_parts.controller.js";

const router = express.Router();

router.route("/add").post(SparePartsController.apiAddSparePart); 
router.route("/getAll").get(SparePartsController.apiGetSpareParts);
router.route("/delete").put(SparePartsController.apiDeleteSparePart);
router.route("/update").put(SparePartsController.apiUpdateSparePart);

export default router;

import express from "express";
import SparePartsController from "./spare_parts.controller.js";
import verifyToken from "../authentication/authentication.js";

const router = express.Router();

router.route("/add").post(verifyToken, SparePartsController.apiAddSparePart); 
router.route("/getAll").get(verifyToken, SparePartsController.apiGetSpareParts);
router.route("/sparePartId/:id").get(verifyToken, SparePartsController.apiGetSparePartById);
router.route("/delete").put(verifyToken, SparePartsController.apiDeleteSparePart);
router.route("/update").put(verifyToken, SparePartsController.apiUpdateSparePart);

export default router;

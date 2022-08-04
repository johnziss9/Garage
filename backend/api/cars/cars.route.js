import express from "express";
import CarsController from "./cars.controller.js";
import verifyToken from "../authentication/authentication.js";

const router = express.Router();

// Cars of any type
router.route("/add").post(verifyToken, CarsController.apiAddCar); // Adds a new car (rental or repair)
router.route("/delete").put(verifyToken, CarsController.apiDeleteCar); // Soft delete of a car (rental or repair)
router.route("/updateRentalStatus").put(verifyToken, CarsController.apiUpdateCarRentalStatus); // Updating a car (rental or repair)
router.route("/updateCarDetails").put(verifyToken, CarsController.apiUpdateCarDetails); // Updating a car (rental or repair)

// Rental Cars
router.route("/getRentals").get(verifyToken, CarsController.apiGetRentalCars); // Gets all the rental cars
router.route("/getActiveRentals").get(verifyToken, CarsController.apiGetActiveRentalCars); // Gets cars with active rentals
router.route("/getInactiveRentals").get(verifyToken, CarsController.apiGetInactiveRentalCars); // Gets cars with not active rentals
router.route("/getExpiringRentals").get(verifyToken, CarsController.apiGetExpiringRentals); // Gets cars with rentals expiring

router.route("/rentalCarId/:id").get(verifyToken, CarsController.apiGetRentalCarById); // Gets a single rental car with all of it's rentals

router.route("/getExpiringMOTs").get(verifyToken, CarsController.apiGetExpiringMOTs); // Gets all the rental cars with their MOT expiring
router.route("/getExpiringRTs").get(verifyToken, CarsController.apiGetExpiringRTs); // Gets all the rental cars with their RT expiring
router.route("/updateMOT").put(verifyToken, CarsController.apiUpdateMOT); // Updated the MOT dates of the rental cars
router.route("/updateRT").put(verifyToken, CarsController.apiUpdateRT); // Updated the RT dates of the rental cars

// Repair Cars
router.route("/getRepairs").get(verifyToken, CarsController.apiGetRepairCars); // Gets all the repair cars with their spare parts
router.route("/getActiveRepairs").get(verifyToken, CarsController.apiGetActiveRepairCars); // Gets cars with active repairs with their spare parts
router.route("/getInactiveRepairs").get(verifyToken, CarsController.apiGetInactiveRepairCars); // Gets cars with inactive repairs with their spare parts

router.route("/repairCarId/:id").get(verifyToken, CarsController.apiGetRepairCarById); // Gets a single repair car with all of it's repairs and spare parts

export default router;

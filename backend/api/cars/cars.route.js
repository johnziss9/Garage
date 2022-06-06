import express from "express";
import CarsController from "./cars.controller.js";

const router = express.Router();

// Cars of any type
router.route("/add").post(CarsController.apiAddCar); // Adds a new car (rental or repair)
router.route("/delete").put(CarsController.apiDeleteCar); // Soft delete of a car (rental or repair)

// Rental Cars
router.route("/getRentals").get(CarsController.apiGetRentalCars); // Gets all the rental cars
router.route("/getActiveRentals").get(CarsController.apiGetActiveRentalCars); // Gets cars with active rentals
router.route("/getInactiveRentals").get(CarsController.apiGetInactiveRentalCars); // Gets cars with not active rentals
router.route("/getExpiringRentals").get(CarsController.apiGetExpiringRentals); // Gets cars with rentals expiring

router.route("/rentalCarId/:id").get(CarsController.apiGetRentalCarById); // Gets a single rental car with all of it's rentals

router.route("/getExpiringMOTs").get(CarsController.apiGetExpiringMOTs); // Gets all the rental cars with their MOT expiring
router.route("/getExpiringRTs").get(CarsController.apiGetExpiringRTs); // Gets all the rental cars with their RT expiring
router.route("/updateMOT").put(CarsController.apiUpdateMOT); // Updated the MOT dates of the rental cars
router.route("/updateRT").put(CarsController.apiUpdateRT); // Updated the RT dates of the rental cars

// Repair Cars
router.route("/getRepairs").get(CarsController.apiGetRepairCars); // Gets al the repair cars
router.route("/getActiveRepairs").get(CarsController.apiGetActiveRepairCars); // Gets cars with active repairs
router.route("/getInactiveRepairs").get(CarsController.apiGetInactiveRepairCars); // Gets cars with inactive repairs

router.route("/repairCarId/:id").get(CarsController.apiGetRepairCarById); // Gets a single repair car with all of it's repairs

export default router;

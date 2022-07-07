import CarsDAO from "../../dao/carsDAO.js";

export default class CarsController {

    static async apiGetRentalCars(req, res, next) {
        const { carList, totalNumberOfCars } = await CarsDAO.getRentalCars();
 
        let response = {
            cars: carList,
            total_results: totalNumberOfCars
        };
        res.json(response);
    }

    static async apiGetExpiringMOTs(req, res, next) {
        const carsPerPage = req.query.carsPerPage ? parseInt(req.query.carsPerPage, 10) : 15;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;
 
        const { carList, totalNumberOfCars } = await CarsDAO.getExpiringMOTs({
            page,
            carsPerPage
        });
 
        let response = {
            cars: carList,
            page: page,
            entries_per_page: carsPerPage,
            total_results: totalNumberOfCars
        };
        res.json(response);
    }

    static async apiGetExpiringRTs(req, res, next) {
        const carsPerPage = req.query.carsPerPage ? parseInt(req.query.carsPerPage, 10) : 15;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;
 
        const { carList, totalNumberOfCars } = await CarsDAO.getExpiringRTs({
            page,
            carsPerPage
        });
 
        let response = {
            cars: carList,
            page: page,
            entries_per_page: carsPerPage,
            total_results: totalNumberOfCars
        };
        res.json(response);
    }

    static async apiUpdateMOT(req, res, next) {
        try {
            const carId = req.body.car_id;
            const motStartDate = new Date(req.body.mot.start_date);
            const motEndDate = new Date(req.body.mot.end_date);
 
            const carMOTResponse = await CarsDAO.updateMOT(
                carId,
                motStartDate,
                motEndDate,
            );
 
            var { error } = carMOTResponse;
            if (error) {
                res.status(400).json({ error });
            }
 
            if (carMOTResponse.modifiedCount === 0) {
                throw new Error("Unable to update the MOT for this car.")
            }
 
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateRT(req, res, next) {
        try {
            const carId = req.body.car_id;
            const rtStartDate = new Date(req.body.road_tax.start_date);
            const rtEndDate = new Date(req.body.road_tax.end_date);
 
            const carRTResponse = await CarsDAO.updateRT(
                carId,
                rtStartDate,
                rtEndDate,
            );
 
            var { error } = carRTResponse;
            if (error) {
                res.status(400).json({ error });
            }
 
            if (carRTResponse.modifiedCount === 0) {
                throw new Error("Unable to update the RT for this car.")
            }
 
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiGetRentalCarById(req, res, next) {
        try {
            let id = req.params.id || {};
            let car = await CarsDAO.getRentalCarById(id);
 
            if (!car) {
                res.status(404).json({ error: "Not Found" });
                return;
            }
 
            res.json(car)
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiAddCar(req, res, next) {
        try {
            const make = req.body.make;
            const model = req.body.model;
            const numberPlate = req.body.number_plate;
            const mot = { 
                start_date: new Date(req.body.mot.start_date),
                end_date: new Date(req.body.mot.end_date)
            };
            const road_tax = {
                start_date: new Date(req.body.road_tax.start_date),
                end_date: new Date(req.body.road_tax.end_date)
            };
            const deleted = req.body.deleted;
            const type = req.body.type;
            const rented = req.body.rented;
 
            const addCarResponse = await CarsDAO.addCar(
                make,
                model,
                numberPlate,
                mot,
                road_tax,
                deleted,
                type,
                rented
            );
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiGetActiveRentalCars(req, res, next) {
        const { carList, totalNumberOfCars } = await CarsDAO.getActiveRentalCars();
 
        let response = {
            cars: carList,
            total_results: totalNumberOfCars
        };
        res.json(response);
    }

    static async apiGetInactiveRentalCars(req, res, next) {
        const { carList, totalNumberOfCars } = await CarsDAO.getInactiveRentalCars();
 
        let response = {
            cars: carList,
            total_results: totalNumberOfCars
        };
        res.json(response);
    }

    static async apiGetExpiringRentals(req, res, next) {
        const { carList, totalNumberOfCars } = await CarsDAO.getExpiringRentals();
 
        let response = {
            cars: carList,
            total_results: totalNumberOfCars
        };
        res.json(response);
    }

    static async apiDeleteCar(req, res, next) {
        try {
            const carId = req.body.car_id;
            const deleted = req.body.deleted;
 
            const deleteCarResponse = await CarsDAO.deleteCar(
                carId,
                deleted
            );
 
            var { error } = deleteCarResponse;
            if (error) {
                res.status(400).json({ error });
            }
 
            if (deleteCarResponse.modifiedCount === 0) {
                throw new Error("Unable to update the car in controller.")
            }
 
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiGetRepairCars(req, res, next) {
        const { carList, totalNumberOfCars } = await CarsDAO.getRepairCars();
 
        let response = {
            cars: carList,
            total_results: totalNumberOfCars
        };
        res.json(response);
    }

    static async apiGetActiveRepairCars(req, res, next) {
        const { carList, totalNumberOfCars } = await CarsDAO.getActiveRepairCars();
 
        let response = {
            cars: carList,
            total_results: totalNumberOfCars
        };
        res.json(response);
    }

    static async apiGetInactiveRepairCars(req, res, next) {
        const { carList, totalNumberOfCars } = await CarsDAO.getInactiveRepairCars();
 
        let response = {
            cars: carList,
            total_results: totalNumberOfCars
        };
        res.json(response);
    }
    
    static async apiGetRepairCarById(req, res, next) {
        try {
            let id = req.params.id || {};
            let car = await CarsDAO.getRepairCarById(id);
 
            if (!car) {
                res.status(404).json({ error: "Not Found" });
                return;
            }
 
            res.json(car)
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiUpdateCar(req, res, next) {
        try {
            const carId = req.body.car_id;
            const rented = req.body.rented;
 
            const updateCarResponse = await CarsDAO.updateCar(
                carId,
                rented
            );
 
            var { error } = updateCarResponse;
            if (error) {
                res.status(400).json({ error });
            }
 
            if (updateCarResponse.modifiedCount === 0) {
                throw new Error("Unable to update the car in controller.")
            }
 
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}
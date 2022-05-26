import CarsDAO from "../dao/carsDAO.js";

export default class CarsController {
    static async apiGetCars(req, res, next) {
        const carsPerPage = req.query.carsPerPage ? parseInt(req.query.carsPerPage, 10) : 15;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;
 
        let filters = {};
        if (req.query.number_plate) {
            filters.number_plate = req.query.number_plate;
        }
 
        const { carList, totalNumberOfCars } = await CarsDAO.getCars({
            filters,
            page,
            carsPerPage
        });
 
        let response = {
            cars: carList,
            page: page,
            filters: filters,
            entries_per_page: carsPerPage,
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

    static async apiGetCarById(req, res, next) {
        try {
            let id = req.params.id || {};
            let car = await CarsDAO.getCarById(id);
 
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
 
            const addCarResponse = await CarsDAO.addCar(
                make,
                model,
                numberPlate,
                mot,
                road_tax
            );
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

}

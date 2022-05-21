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
}

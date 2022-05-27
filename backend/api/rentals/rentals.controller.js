import RentalsDAO from "../../dao/rentalsDAO.js";

export default class RentalsController {
    
    static async apiGetRentals(req, res, next) {

        const rentalList = await RentalsDAO.getRentals();
 
        let response = {
            rentals: rentalList,

        };
        res.json(response);
    }
}
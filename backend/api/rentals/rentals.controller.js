import RentalsDAO from "../../dao/rentalsDAO.js";

export default class RentalsController {

    static async apiAddRental(req, res, next) {
        try {
            const carId = req.body.car_id;
            const firstName = req.body.first_name;
            const lastName = req.body.last_name;
            const phoneNumber = req.body.phone_number;
            const address = req.body.address;
            const dates = {
                startDate: new Date(req.body.dates.start_date),
                endDate: new Date(req.body.dates.end_date)
            };
 
            const addRentalResponse = await RentalsDAO.addRental(
                carId,
                firstName,
                lastName,
                phoneNumber,
                address,
                dates
            );

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}
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
            const deleted = req.body.deleted;
 
            const addRentalResponse = await RentalsDAO.addRental(
                carId,
                firstName,
                lastName,
                phoneNumber,
                address,
                dates,
                deleted
            );

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiGetRentals(req, res, next) {

        const { rentalsList, totalNumberOfRentals } = await RentalsDAO.getRentals();

        let response = {
            rentals: rentalsList,
            total_results: totalNumberOfRentals

        };
        res.json(response);
    }

    static async apiGetPastRentals(req, res, next) {
 
        const { pastRentalsList, totalNumberOfPastRentals } = await RentalsDAO.getPastRentals();
 
        let response = {
            pastRentals: pastRentalsList,
            total_results: totalNumberOfPastRentals
        };
        res.json(response);
    }

    static async apiGetFutureRentals(req, res, next) {
 
        const { futureRentalsList, totalNumberOfFutureRentals } = await RentalsDAO.getFutureRentals();
 
        let response = {
            futureRentals: futureRentalsList,
            total_results: totalNumberOfFutureRentals
        };
        res.json(response);
    }

    static async apiGetCurrentRentals(req, res, next) {
 
        const { currentRentalsList, totalNumberOfCurrentRentals } = await RentalsDAO.getCurrentRentals();
 
        let response = {
            currentRentals: currentRentalsList,
            total_results: totalNumberOfCurrentRentals
        };
        res.json(response);
    }

    static async apiUpdateRental(req, res, next) {
        try {
            const rentalId = req.body.rental_id;
            const firstName = req.body.first_name;
            const lastName = req.body.last_name;
            const phoneNumber = req.body.phone_number;
            const address = req.body.address;
            const rentalStartDate = new Date(req.body.dates.start_date);
            const rentalEndDate = new Date(req.body.dates.end_date);
 
            const rentalResponse = await RentalsDAO.updateRental(
                rentalId,
                firstName,
                lastName,
                phoneNumber,
                address,
                rentalStartDate,
                rentalEndDate
            );
 
            var { error } = rentalResponse;
            if (error) {
                res.status(400).json({ error });
            }
 
            if (rentalResponse.modifiedCount === 0) {
                throw new Error("Unable to update the rental in controller.")
            }
 
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateRentalDates(req, res, next) {
        try {
            const rentalId = req.body.rental_id;
            const rentalStartDate = new Date(req.body.dates.start_date);
            const rentalEndDate = new Date(req.body.dates.end_date);
 
            const rentalResponse = await RentalsDAO.updateRentalDates(
                rentalId,
                rentalStartDate,
                rentalEndDate
            );
 
            var { error } = rentalResponse;
            if (error) {
                res.status(400).json({ error });
            }
 
            if (rentalResponse.modifiedCount === 0) {
                throw new Error("Unable to update the rental in controller.")
            }
 
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeleteRental(req, res, next) {
        try {
            const rentalId = req.body.rental_id;
            const deleted = req.body.deleted;
 
            const rentalResponse = await RentalsDAO.deleteRental(
                rentalId,
                deleted
            );
 
            var { error } = rentalResponse;
            if (error) {
                res.status(400).json({ error });
            }
 
            if (rentalResponse.modifiedCount === 0) {
                throw new Error("Unable to update the rental in controller.")
            }
 
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}
import RepairsDAO from "../../dao/repairsDAO.js";

export default class RepairsController {

    static async apiAddRepair(req, res, next) {
        try {
            const carId = req.body.car_id;
            const customer_details = {
                first_name: req.body.customer_details.first_name,
                last_name: req.body.customer_details.last_name,
                phone_number: req.body.customer_details.phone_number,
                address: req.body.customer_details.address,
                email: req.body.customer_details.email
            };
            const insurance_details = {
                name: req.body.insurance_details.name,
                insurer_name: req.body.insurance_details.insurer_name,
                insurer_phone_number: req.body.insurance_details.insurer_phone_number,
                operator_name: req.body.insurance_details.operator_name,
                operator_phone_number: req.body.insurance_details.operator_phone_number,
                amount: req.body.insurance_details.amount
            };
            const repair_details = {
                repair_date: new Date(req.body.repair_details.repair_date),
                received_date: new Date(req.body.repair_details.received_date),
                due_date: new Date(req.body.repair_details.due_date)
            };
            const isiomata = req.body.isiomata;
            const paintings = req.body.paintings;
            const mechanical = req.body.mechanical;
            const electric = req.body.electric;
            const aircon = req.body.aircon;
            const additional_notes = req.body.additional_notes;
 
            const addRepairResponse = await RepairsDAO.addRepair(
                carId,
                customer_details,
                insurance_details,
                repair_details,
                isiomata,
                paintings,
                mechanical,
                electric,
                aircon,
                additional_notes
            );

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    // static async apiGetRentals(req, res, next) {

    //     const { rentalsList, totalNumberOfRentals } = await RentalsDAO.getRentals();

    //     let response = {
    //         rentals: rentalsList,
    //         total_results: totalNumberOfRentals

    //     };
    //     res.json(response);
    // }

    // static async apiGetPastRentals(req, res, next) {
 
    //     const { pastRentalsList, totalNumberOfPastRentals } = await RentalsDAO.getPastRentals();
 
    //     let response = {
    //         pastRentals: pastRentalsList,
    //         total_results: totalNumberOfPastRentals
    //     };
    //     res.json(response);
    // }

    // static async apiGetFutureRentals(req, res, next) {
 
    //     const { futureRentalsList, totalNumberOfFutureRentals } = await RentalsDAO.getFutureRentals();
 
    //     let response = {
    //         futureRentals: futureRentalsList,
    //         total_results: totalNumberOfFutureRentals
    //     };
    //     res.json(response);
    // }

    // static async apiGetCurrentRentals(req, res, next) {
 
    //     const { currentRentalsList, totalNumberOfCurrentRentals } = await RentalsDAO.getCurrentRentals();
 
    //     let response = {
    //         currentRentals: currentRentalsList,
    //         total_results: totalNumberOfCurrentRentals
    //     };
    //     res.json(response);
    // }

    // static async apiUpdateRental(req, res, next) {
    //     try {
    //         const rentalId = req.body.rental_Id;
    //         const firstName = req.body.first_name;
    //         const lastName = req.body.last_name;
    //         const phoneNumber = req.body.phone_number;
    //         const address = req.body.address;
    //         const rentalStartDate = new Date(req.body.dates.start_date);
    //         const rentalEndDate = new Date(req.body.dates.end_date);
 
    //         const rentalResponse = await RentalsDAO.updateRental(
    //             rentalId,
    //             firstName,
    //             lastName,
    //             phoneNumber,
    //             address,
    //             rentalStartDate,
    //             rentalEndDate
    //         );
 
    //         var { error } = rentalResponse;
    //         if (error) {
    //             res.status(400).json({ error });
    //         }
 
    //         if (rentalResponse.modifiedCount === 0) {
    //             throw new Error("Unable to update the rental in controller.")
    //         }
 
    //         res.json({ status: "success" });
    //     } catch (e) {
    //         res.status(500).json({ error: e.message });
    //     }
    // }

    // static async apiDeleteRental(req, res, next) {
    //     try {
    //         const rentalId = req.body.rental_Id;
    //         const deleted = req.body.deleted;
 
    //         const rentalResponse = await RentalsDAO.deleteRental(
    //             rentalId,
    //             deleted
    //         );
 
    //         var { error } = rentalResponse;
    //         if (error) {
    //             res.status(400).json({ error });
    //         }
 
    //         if (rentalResponse.modifiedCount === 0) {
    //             throw new Error("Unable to update the rental in controller.")
    //         }
 
    //         res.json({ status: "success" });
    //     } catch (e) {
    //         res.status(500).json({ error: e.message });
    //     }
    // }
}
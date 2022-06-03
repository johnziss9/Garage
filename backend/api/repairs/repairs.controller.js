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
            const deleted = req.body.deleted;
 
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
                additional_notes,
                deleted
            );

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiGetRepairs(req, res, next) {

        const { repairsList, totalNumberOfRepairs } = await RepairsDAO.getRepairs();

        let response = {
            repairs: repairsList,
            total_results: totalNumberOfRepairs

        };
        res.json(response);
    }

    static async apiGetPastRepairs(req, res, next) {
 
        const { pastRepairsList, totalNumberOfPastRepairs } = await RepairsDAO.getPastRepairs();
 
        let response = {
            pastRepairs: pastRepairsList,
            total_results: totalNumberOfPastRepairs
        };
        res.json(response);
    }

    static async apiGetFutureRepairs(req, res, next) {
 
        const { futureRepairsList, totalNumberOfFutureRepairs } = await RepairsDAO.getFutureRepairs();
 
        let response = {
            futureRepairs: futureRepairsList,
            total_results: totalNumberOfFutureRepairs
        };
        res.json(response);
    }

    static async apiGetCurrentRepairs(req, res, next) {
 
        const { currentRepairsList, totalNumberOfCurrentRepairs } = await RepairsDAO.getCurrentRepairs();
 
        let response = {
            currentRepairs: currentRepairsList,
            total_results: totalNumberOfCurrentRepairs
        };
        res.json(response);
    }

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

    static async apiDeleteRepair(req, res, next) {
        try {
            const repairId = req.body.repair_id;
            const deleted = req.body.deleted;
 
            const repairResponse = await RepairsDAO.deleteRepair(
                repairId,
                deleted
            );
 
            var { error } = repairResponse;
            if (error) {
                res.status(400).json({ error });
            }
 
            if (repairResponse.modifiedCount === 0) {
                throw new Error("Unable to update the repair in controller.")
            }
 
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}
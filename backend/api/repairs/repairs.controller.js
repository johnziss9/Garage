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
                paid_amount: req.body.insurance_details.paid_amount
            };
            const repair_dates = {
                acceptance_date: new Date(req.body.repair_dates.acceptance_date),
                received_date: new Date(req.body.repair_dates.received_date),
                delivery_date: new Date(req.body.repair_dates.delivery_date)
            };
            const alignments = req.body.alignments;
            const paintings = req.body.paintings;
            const mechanical = req.body.mechanical;
            const electrical = req.body.electrical;
            const air_condition = req.body.air_condition;
            const additional_work = req.body.additional_work;
            const completed = req.body.completed;
            const deleted = req.body.deleted;
 
            const addRepairResponse = await RepairsDAO.addRepair(
                carId,
                customer_details,
                insurance_details,
                repair_dates,
                alignments,
                paintings,
                mechanical,
                electrical,
                air_condition,
                additional_work,
                completed,
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

    static async apiGetRepairById(req, res, next) {
        try {
            let id = req.params.id || {};
            let repair = await RepairsDAO.getRepairById(id);
 
            if (!repair) {
                res.status(404).json({ error: "Not Found" });
                return;
            }
 
            res.json(repair)
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiUpdateCustomerDetails(req, res, next) {
        try {
            const repairId = req.body.repair_id;
            const firstName = req.body.customer_details.first_name;
            const lastName = req.body.customer_details.last_name;
            const phoneNumber = req.body.customer_details.phone_number;
            const address = req.body.customer_details.address;
            const email = req.body.customer_details.email;
 
            const repairResponse = await RepairsDAO.updateCustomerDetails(
                repairId,
                firstName,
                lastName,
                phoneNumber,
                address,
                email
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

    static async apiUpdateInsuranceDetails(req, res, next) {
        try {
            const repairId = req.body.repair_id;
            const insuranceName = req.body.insurance_details.name;
            const insurerName = req.body.insurance_details.insurer_name;
            const insurerPhoneNumber = req.body.insurance_details.insurer_phone_number;
            const operatorName = req.body.insurance_details.operator_name;
            const operatorPhoneNumber = req.body.insurance_details.operator_phone_number;
            const claimNumber = req.body.insurance_details.claim_number;
            const paidAmount = req.body.insurance_details.paid_amount;
 
            const repairResponse = await RepairsDAO.updateInsuranceDetails(
                repairId,
                insuranceName,
                insurerName,
                insurerPhoneNumber,
                operatorName,
                operatorPhoneNumber,
                claimNumber,
                paidAmount
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

    static async apiUpdateDates(req, res, next) {
        try {
            const repairId = req.body.repair_id;
            const acceptanceDate = req.body.repair_dates.acceptance_date;
            const receievedDate = req.body.repair_dates.received_date;
            const deliveryDate = req.body.repair_dates.delivery_date;
 
            const repairResponse = await RepairsDAO.updateDates(
                repairId,
                acceptanceDate,
                receievedDate,
                deliveryDate
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

    static async apiUpdateAlignments(req, res, next) {
        try {
            const repairId = req.body.repair_id;
            const alignments = req.body.alignments;
 
            const repairResponse = await RepairsDAO.updateAlignments(
                repairId,
                alignments
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

    static async apiUpdatePaintings(req, res, next) {
        try {
            const repairId = req.body.repair_id;
            const paintings = req.body.paintings;
 
            const repairResponse = await RepairsDAO.updatePaintings(
                repairId,
                paintings
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

    static async apiUpdateMechanical(req, res, next) {
        try {
            const repairId = req.body.repair_id;
            const mechanical = req.body.mechanical;
            
            const repairResponse = await RepairsDAO.updateMechanical(
                repairId,
                mechanical
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

    static async apiUpdateElectrical(req, res, next) {
        try {
            const repairId = req.body.repair_id;
            const electrical = req.body.electrical;

            const repairResponse = await RepairsDAO.updateElectrical(
                repairId,
                electrical
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

    static async apiUpdateAirCondition(req, res, next) {
        try {
            const repairId = req.body.repair_id;
            const airCondition = req.body.air_condition;
 
            const repairResponse = await RepairsDAO.updateAirCondition(
                repairId,
                airCondition
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

    static async apiUpdateAdditionalWork(req, res, next) {
        try {
            const repairId = req.body.repair_id;
            const additionalWork = req.body.additional_work;
 
            const repairResponse = await RepairsDAO.updateAdditionalWork(
                repairId,
                additionalWork
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
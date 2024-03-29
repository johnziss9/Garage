import mongodb from 'mongodb';
		 
const ObjectId = mongodb.ObjectId;

let repairs;

export default class RepairsDAO {

    // This method will run as soon as the server starts and it connect to the database.
    static async injectDB(conn) {
        if (repairs) {
            return;
        }
        try {
            repairs = await conn.db(process.env.GARAGE_NS).collection("repairs");
        } catch (e) {
            console.error(`Unable to establish a collection in repairsDAO: ${e}`);
        }
    }

    static async addRepair(carId, customerDetails, insuranceDetails, repairDates, alignments, paintings, mechanical, electrical, airCondition, additionalWork, completed, deleted) {
        try {
            const repair = { 
                car_id: ObjectId(carId),
                customer_details: {
                    first_name: customerDetails.first_name,
                    last_name: customerDetails.last_name,
                    phone_number: customerDetails.phone_number,
                    address: customerDetails.address,
                    email: customerDetails.email
                },
                insurance_details: {
                    name: insuranceDetails.name,
                    insurer_name: insuranceDetails.insurer_name,
                    insurer_phone_number: insuranceDetails.insurer_phone_number,
                    operator_name: insuranceDetails.operator_name,
                    operator_phone_number: insuranceDetails.operator_phone_number,
                    claim_number: insuranceDetails.claim_number,
                    paid_amount: insuranceDetails.paid_amount
                },
                repair_dates: {
                    acceptance_date: repairDates.acceptance_date,
                    received_date: repairDates.received_date,
                    delivery_date: repairDates.delivery_date
                },
                alignments: alignments,
                paintings: paintings,
                mechanical: mechanical,
                electrical: electrical,
                air_condition: airCondition,
                additional_work: additionalWork,
                completed: completed,
                deleted: deleted
            };
 
            return await repairs.insertOne(repair);
        } catch (e) {
            console.error(`Unable to add repair: ${e}`);
     return { error: e };
        }
    }

    static async getRepairs({} = {}) {
        let query;

        query = {"deleted": { $eq: false }}

        let cursor;

        try {
            cursor = await repairs.find(query);
        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return { repairsList: [], totalNumberOfRepairs: 0 }
        }

        try {
            const repairsList = await cursor.toArray();
            const totalNumberOfRepairs = await repairs.countDocuments(query);

            return { repairsList, totalNumberOfRepairs }
        } catch(e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { repairsList: [], totalNumberOfRepairs: 0 }
        } 
    }

    static async getPastRepairs({} = {}) {
        let query;
        let currentDate = new Date();

        query = {"repair_details.due_date": { $lt: currentDate }, "deleted": { $eq: false }}

        let cursor;
    
        try {
            cursor = await repairs.find(query);
        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return { pastRepairsList: [], totalNumberOfPastRepairs: 0 }
        }
        
        try {
            const pastRepairsList = await cursor.toArray();
            const totalNumberOfPastRepairs = await repairs.countDocuments(query);
    
            return { pastRepairsList, totalNumberOfPastRepairs }
        } catch(e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { pastRepairsList: [], totalNumberOfPastRepairs: 0 }
        } 
    }

    static async getFutureRepairs({} = {}) {
        let query;
        let currentDate = new Date();

        query = {"repair_details.received_date": { $gt: currentDate }, "deleted": { $eq: false }}

        let cursor;
    
        try {
            cursor = await repairs.find(query);
        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return { futureRepairsList: [], totalNumberOfFutureRepairs: 0 }
        }
        
        try {
            const futureRepairsList = await cursor.toArray();
            const totalNumberOfFutureRepairs = await repairs.countDocuments(query);
    
            return { futureRepairsList, totalNumberOfFutureRepairs }
        } catch(e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { futureRepairsList: [], totalNumberOfFutureRepairs: 0 }
        } 
    }

    static async getCurrentRepairs({} = {}) {
        let query;
        let currentDate = new Date();

        query = {"repair_details.received_date": { $lte: currentDate }, "repair_details.due_date": { $gte: currentDate }, "deleted": { $eq: false }}

        let cursor;
    
        try {
            cursor = await repairs.find(query);
        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return { currentRepairsList: [], totalNumberOfCurrentRepairs: 0 }
        }
        
        try {
            const currentRepairsList = await cursor.toArray();
            const totalNumberOfCurrentRepairs = await repairs.countDocuments(query);
    
            return { currentRepairsList, totalNumberOfCurrentRepairs }
        } catch(e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { currentRepairsList: [], totalNumberOfCurrentRepairs: 0 }
        } 
    }

    static async getRepairById(id) {
        try {
            const pipeline = [
                {
                    $match: {
                        _id: new ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: "spare_parts",
                        let: {
                            id: "$_id"
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$repair_id", "$$id"]
                                    }
                                }
                            },
                            {
                                $sort: {
                                    date: -1
                                }
                            }
                        ],
                        as: "spare_parts"
                    }
                },
                {
                    $addFields: {
                        spare_parts: "$spare_parts"
                    }
                }
            ]
            return await repairs.aggregate(pipeline).next();
        } catch (e) {
            console.error(`Something went wrong in getRepairById: ${e}`);
            throw e;
        }
    }

    static async updateCustomerDetails(
        repairId,
        firstName,
        lastName,
        phoneNumber,
        address,
        email) {
        try {
            const updateResponse = await repairs.updateOne(
                { _id: ObjectId(repairId) },
                { $set: { 
                        customer_details: {
                            first_name: firstName,
                            last_name: lastName,
                            phone_number: phoneNumber,
                            address: address,
                            email: email
                        }
                    }
                }
            );
 
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update repair in DAO: ${e}`);
        
        return { error: e };
        }
    }

    static async updateInsuranceDetails(
        repairId,
        insuranceName,
        insurerName,
        insurerPhoneNumber,
        operatorName,
        operatorPhoneNumber,
        claimNumber,
        paidAmount) {
        try {
            const updateResponse = await repairs.updateOne(
                { _id: ObjectId(repairId) },
                { $set: { 
                        insurance_details: {
                            name: insuranceName,
                            insurer_name: insurerName,
                            insurer_phone_number: insurerPhoneNumber,
                            operator_name: operatorName,
                            operator_phone_number: operatorPhoneNumber,
                            claim_number: claimNumber,
                            paid_amount: paidAmount
                        }
                    }
                }
            );
 
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update repair in DAO: ${e}`);
        
        return { error: e };
        }
    }

    static async updateDates(
        repairId,
        acceptanceDate,
        receievedDate,
        deliveryDate) {
        try {
            const updateResponse = await repairs.updateOne(
                { _id: ObjectId(repairId) },
                { $set: { 
                        repair_dates: {
                            acceptance_date: acceptanceDate,
                            received_date: receievedDate,
                            delivery_date: deliveryDate
                        }
                    }
                }
            );
 
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update repair in DAO: ${e}`);
        
        return { error: e };
        }
    }

    static async updateAlignments(
        repairId,
        alignments) {
        try {
            const updateResponse = await repairs.updateOne(
                { _id: ObjectId(repairId) },
                { $set: { 
                        alignments: alignments
                    }
                }
            );
 
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update repair in DAO: ${e}`);
        
        return { error: e };
        }
    }

    static async updatePaintings(
        repairId,
        paintings) {
        try {
            const updateResponse = await repairs.updateOne(
                { _id: ObjectId(repairId) },
                { $set: { 
                        paintings: paintings
                    }
                }
            );
 
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update repair in DAO: ${e}`);
        
        return { error: e };
        }
    }

    static async updateMechanical(
        repairId,
        mechanical) {
        try {
            const updateResponse = await repairs.updateOne(
                { _id: ObjectId(repairId) },
                { $set: { 
                        mechanical: mechanical
                    }
                }
            );
 
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update repair in DAO: ${e}`);
        
        return { error: e };
        }
    }

    static async updateElectrical(
        repairId,
        electrical) {
        try {
            const updateResponse = await repairs.updateOne(
                { _id: ObjectId(repairId) },
                { $set: { 
                        electrical: electrical
                    }
                }
            );
 
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update repair in DAO: ${e}`);
        
        return { error: e };
        }
    }

    static async updateAirCondition(
        repairId,
        airCondition) {
        try {
            const updateResponse = await repairs.updateOne(
                { _id: ObjectId(repairId) },
                { $set: { 
                        air_condition: airCondition
                    }
                }
            );
 
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update repair in DAO: ${e}`);
        
        return { error: e };
        }
    }

    static async updateAdditionalWork(
        repairId,
        additionalWork) {
        try {
            const updateResponse = await repairs.updateOne(
                { _id: ObjectId(repairId) },
                { $set: { 
                        additional_work: additionalWork
                    }
                }
            );
 
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update repair in DAO: ${e}`);
        
        return { error: e };
        }
    }

    static async deleteRepair(repairId, deleted) {
        try {
            const updateResponse = await repairs.updateOne(
                { _id: ObjectId(repairId) },
                { $set: { 
                        deleted: deleted
                    }
                }
            );
 
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update repair in DAO: ${e}`);
        
        return { error: e };
        }
    }
}
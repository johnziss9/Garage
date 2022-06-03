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

    static async addRepair(carId, customerDetails, insuranceDetails, repairDetails, isiomata, paintings, mechanical, electric, aircon, additionalNotes, deleted) {
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
                    amount: insuranceDetails.amount
                },
                repair_details: {
                    repair_date: repairDetails.repair_date,
                    received_date: repairDetails.received_date,
                    due_date: repairDetails.due_date
                },
                isiomata: isiomata,
                paintings: paintings,
                mechanical: mechanical,
                electric: electric,
                aircon: aircon,
                additional_notes: additionalNotes,
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

    // static async updateRental(rentalId, firstName, lastName, phoneNumber, address, rentalStartDate, rentalEndDate) {
    //     try {
    //         const updateResponse = await rentals.updateOne(
    //             { _id: ObjectId(rentalId) },
    //             { $set: { 
    //                     first_name: firstName,
    //                     last_name: lastName,
    //                     phone_number: phoneNumber,
    //                     address: address,
    //                     dates: {
    //                         start_date: rentalStartDate,
    //                         end_date: rentalEndDate
    //                     }
    //                 }
    //             }
    //         );
 
    //         return updateResponse;
    //     } catch (e) {
    //         console.error(`Unable to update rental in DAO: ${e}`);
        
    //     return { error: e };
    //     }
    // }

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
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

    static async addRepair(carId, customerDetails, insuranceDetails, repairDetails, isiomata, paintings, mechanical, electric, aircon, additionalNotes) {
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
                additional_notes: additionalNotes
            };
 
            return await repairs.insertOne(repair);
        } catch (e) {
            console.error(`Unable to add repair: ${e}`);
     return { error: e };
        }
    }

    // static async getRentals({} = {}) {
    //     let query;

    //     query = {"deleted": { $eq: false }}

    //     let cursor;

    //     try {
    //         cursor = await rentals.find(query);
    //     } catch(e) {
    //         console.error(`Unable to issue find command, ${e}`);
    //         return { rentalsList: [], totalNumberOfRentals: 0 }
    //     }

    //     try {
    //         const rentalsList = await cursor.toArray();
    //         const totalNumberOfRentals = await rentals.countDocuments(query);

    //         return { rentalsList, totalNumberOfRentals }
    //     } catch(e) {
    //         console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
    //         return { rentalsList: [], totalNumberOfRentals: 0 }
    //     } 
    // }

    // static async getPastRentals({} = {}) {
    //     let query;
    //     let currentDate = new Date();

    //     query = {"dates.end_date": { $lt: currentDate }, "deleted": { $eq: false }}

    //     let cursor;
    
    //     try {
    //         cursor = await rentals.find(query);
    //     } catch(e) {
    //         console.error(`Unable to issue find command, ${e}`);
    //         return { pastRentalsList: [], totalNumberOfPastRentals: 0 }
    //     }
        
    //     try {
    //         const pastRentalsList = await cursor.toArray();
    //         const totalNumberOfPastRentals = await rentals.countDocuments(query);
    
    //         return { pastRentalsList, totalNumberOfPastRentals }
    //     } catch(e) {
    //         console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
    //         return { pastRentalsList: [], totalNumberOfPastRentals: 0 }
    //     } 
    // }

    // static async getFutureRentals({} = {}) {
    //     let query;
    //     let currentDate = new Date();

    //     query = {"dates.start_date": { $gt: currentDate }, "deleted": { $eq: false }}

    //     let cursor;
    
    //     try {
    //         cursor = await rentals.find(query);
    //     } catch(e) {
    //         console.error(`Unable to issue find command, ${e}`);
    //         return { futureRentalsList: [], totalNumberOfFutureRentals: 0 }
    //     }
        
    //     try {
    //         const futureRentalsList = await cursor.toArray();
    //         const totalNumberOfFutureRentals = await rentals.countDocuments(query);
    
    //         return { futureRentalsList, totalNumberOfFutureRentals }
    //     } catch(e) {
    //         console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
    //         return { futureRentalsList: [], totalNumberOfFutureRentals: 0 }
    //     } 
    // }

    // static async getCurrentRentals({} = {}) {
    //     let query;
    //     let currentDate = new Date();

    //     query = {"dates.start_date": { $lte: currentDate }, "dates.end_date": { $gte: currentDate }, "deleted": { $eq: false }}

    //     let cursor;
    
    //     try {
    //         cursor = await rentals.find(query);
    //     } catch(e) {
    //         console.error(`Unable to issue find command, ${e}`);
    //         return { currentRentalsList: [], totalNumberOfCurrentRentals: 0 }
    //     }
        
    //     try {
    //         const currentRentalsList = await cursor.toArray();
    //         const totalNumberOfCurrentRentals = await rentals.countDocuments(query);
    
    //         return { currentRentalsList, totalNumberOfCurrentRentals }
    //     } catch(e) {
    //         console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
    //         return { currentRentalsList: [], totalNumberOfCurrentRentals: 0 }
    //     } 
    // }

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

    // static async deleteRental(rentalId, deleted) {
    //     try {
    //         const updateResponse = await rentals.updateOne(
    //             { _id: ObjectId(rentalId) },
    //             { $set: { 
    //                     deleted: deleted
    //                 }
    //             }
    //         );
 
    //         return updateResponse;
    //     } catch (e) {
    //         console.error(`Unable to update rental in DAO: ${e}`);
        
    //     return { error: e };
    //     }
    // }
}
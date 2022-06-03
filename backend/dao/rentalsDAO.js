import mongodb from 'mongodb';
		 
const ObjectId = mongodb.ObjectId;

let rentals;

export default class RentalsDAO {

    // This method will run as soon as the server starts and it connect to the database.
    static async injectDB(conn) {
        if (rentals) {
            return;
        }
        try {
            rentals = await conn.db(process.env.GARAGE_NS).collection("rentals");
        } catch (e) {
            console.error(`Unable to establish a collection in rentalsDAO: ${e}`);
        }
    }

    static async addRental(carId, firstName, lastName, phoneNumber, address, dates, deleted) {
        try {
            const rental = { 
                car_id: ObjectId(carId),
                first_name: firstName,
                last_name: lastName,
                phone_number: phoneNumber,
                address: address,
                dates: {
                    start_date: dates.startDate,
                    end_date: dates.endDate
                },
                deleted: deleted
            };
 
            return await rentals.insertOne(rental);
        } catch (e) {
            console.error(`Unable to add rental: ${e}`);
     return { error: e };
        }
    }

    static async getRentals({} = {}) {
        let query;

        query = {"deleted": { $eq: false }}

        let cursor;

        try {
            cursor = await rentals.find(query);
        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return { rentalsList: [], totalNumberOfRentals: 0 }
        }

        try {
            const rentalsList = await cursor.toArray();
            const totalNumberOfRentals = await rentals.countDocuments(query);

            return { rentalsList, totalNumberOfRentals }
        } catch(e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { rentalsList: [], totalNumberOfRentals: 0 }
        } 
    }

    static async getPastRentals({} = {}) {
        let query;
        let currentDate = new Date();

        query = {"dates.end_date": { $lt: currentDate }, "deleted": { $eq: false }}

        let cursor;
    
        try {
            cursor = await rentals.find(query);
        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return { pastRentalsList: [], totalNumberOfPastRentals: 0 }
        }
        
        try {
            const pastRentalsList = await cursor.toArray();
            const totalNumberOfPastRentals = await rentals.countDocuments(query);
    
            return { pastRentalsList, totalNumberOfPastRentals }
        } catch(e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { pastRentalsList: [], totalNumberOfPastRentals: 0 }
        } 
    }

    static async getFutureRentals({} = {}) {
        let query;
        let currentDate = new Date();

        query = {"dates.start_date": { $gt: currentDate }, "deleted": { $eq: false }}

        let cursor;
    
        try {
            cursor = await rentals.find(query);
        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return { futureRentalsList: [], totalNumberOfFutureRentals: 0 }
        }
        
        try {
            const futureRentalsList = await cursor.toArray();
            const totalNumberOfFutureRentals = await rentals.countDocuments(query);
    
            return { futureRentalsList, totalNumberOfFutureRentals }
        } catch(e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { futureRentalsList: [], totalNumberOfFutureRentals: 0 }
        } 
    }

    static async getCurrentRentals({} = {}) {
        let query;
        let currentDate = new Date();

        query = {"dates.start_date": { $lte: currentDate }, "dates.end_date": { $gte: currentDate }, "deleted": { $eq: false }}

        let cursor;
    
        try {
            cursor = await rentals.find(query);
        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return { currentRentalsList: [], totalNumberOfCurrentRentals: 0 }
        }
        
        try {
            const currentRentalsList = await cursor.toArray();
            const totalNumberOfCurrentRentals = await rentals.countDocuments(query);
    
            return { currentRentalsList, totalNumberOfCurrentRentals }
        } catch(e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { currentRentalsList: [], totalNumberOfCurrentRentals: 0 }
        } 
    }

    static async updateRental(rentalId, firstName, lastName, phoneNumber, address, rentalStartDate, rentalEndDate) {
        try {
            const updateResponse = await rentals.updateOne(
                { _id: ObjectId(rentalId) },
                { $set: { 
                        first_name: firstName,
                        last_name: lastName,
                        phone_number: phoneNumber,
                        address: address,
                        dates: {
                            start_date: rentalStartDate,
                            end_date: rentalEndDate
                        }
                    }
                }
            );
 
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update rental in DAO: ${e}`);
        
        return { error: e };
        }
    }

    static async deleteRental(rentalId, deleted) {
        try {
            const updateResponse = await rentals.updateOne(
                { _id: ObjectId(rentalId) },
                { $set: { 
                        deleted: deleted
                    }
                }
            );
 
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update rental in DAO: ${e}`);
        
        return { error: e };
        }
    }
}
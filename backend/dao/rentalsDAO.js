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
            console.error(`Unable to establish a collection in carsDAO: ${e}`);
        }
    }

    static async addRental(carId, firstName, lastName, phoneNumber, address, dates) {
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
                }
            };
 
            return await rentals.insertOne(rental);
        } catch (e) {
            console.error(`Unable to add rental: ${e}`);
     return { error: e };
        }
    }
}
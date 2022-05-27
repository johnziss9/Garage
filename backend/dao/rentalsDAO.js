import mongodb from 'mongodb';
		 
// const ObjectId = mongodb.ObjectId;

let rentals;

export default class RentalsDAO {
		 
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
    
    static async getRentals({} = {}) {
        let cursor;

        try {
            cursor = await rentals.find();
        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return { rentalList: [], totalNumberOfRentals: 0 }
        }
        
        try {
            const rentalList = await cursor.toArray();
            const totalNumberOfRentals = await rentals.countDocuments();
    
            return { rentalList, totalNumberOfRentals }
        } catch(e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { rentalList: [], totalNumberOfRentals: 0 }
        } 
    }
}
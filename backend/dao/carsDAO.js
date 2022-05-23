let cars;

export default class CarsDAO {
		 
    // This method will run as soon as the server starts and it connect to the database.
    static async injectDB(conn) {
        if (cars) {
            return;
        }
        try {
            cars = await conn.db(process.env.GARAGE_NS).collection("cars");
        } catch (e) {
            console.error(`Unable to establish a collection in carsDAO: ${e}`);
        }
    }
    
    // This method will be called if we want to get all the cars from the database
    static async getCars({
        filters = null,
        page = 0,
        carsPerPage = 15
    } = {}) {
        let query;
    
        // $eq stands for equals
        // When this method is called and we pass in any of the filters below, it will query the data.
        if (filters) {
            // This first if statement doesn't know in which property to do a text search. We will set that later in Mongo Atlas.
            if ("number_plate" in filters) {
                query = { $text: { $search: filters["number_plate"]}}
            }
        }
    
        let cursor;
    
        try {
            // If the query is not empty, it will run the find function to match the cars.
            cursor = await cars.find(query);
        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return { carList: [], totalNumberOfCars: 0 }
        }
    
        const displayCursor = cursor.limit(carsPerPage).skip(carsPerPage * page);
    
        try {
            const carList = await displayCursor.toArray();
            const totalNumberOfCars = await cars.countDocuments(query);
    
            return { carList, totalNumberOfCars }
        } catch(e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { carList: [], totalNumberOfCars: 0 }
        } 
    }
}

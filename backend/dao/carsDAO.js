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
    
        // When this method is called and we pass in any of the filters below, it will query the data.
        if (filters) {
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

    static async getExpiringMOTs({
        page = 0,
        carsPerPage = 15
    } = {}) {
        let query;
        let currentDate = new Date();
        let currentDateToChange = new Date(); // Using this as a provisional variable as the line below changes its value.
        let currentDateTwoWeeks = new Date(currentDateToChange.setDate(currentDateToChange.getDate() + 14));

        query = {"mot.end_date" : { $gte : currentDate, $lte: currentDateTwoWeeks }}

        let cursor;
    
        try {
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

    static async getExpiringRTs({
        page = 0,
        carsPerPage = 15
    } = {}) {
        let query;
        let currentDate = new Date();
        let currentDateToChange = new Date(); // Using this as a provisional variable as the line below changes its value.
        let currentDateTwoWeeks = new Date(currentDateToChange.setDate(currentDateToChange.getDate() + 14));

        query = {"road_tax.end_date" : { $gte : currentDate, $lte: currentDateTwoWeeks }}

        let cursor;
    
        try {
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

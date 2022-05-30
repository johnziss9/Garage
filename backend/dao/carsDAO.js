import mongodb from 'mongodb';
		 
const ObjectId = mongodb.ObjectId;

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
        page = 0,
        carsPerPage = 15
    } = {}) {
        let cursor;
    
        try {
            const pipeline = [
                {
                    $lookup: {
                        from: "rentals",
                        localField: "_id",
                        foreignField: "car_id",
                        as: "rentals"
                    }
                }
            ]
            
            cursor = await cars.aggregate(pipeline);

        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return { carList: [], totalNumberOfCars: 0 }
        }
    
        const displayCursor = cursor.limit(carsPerPage).skip(carsPerPage * page);
    
        try {
            const carList = await displayCursor.toArray();
            const totalNumberOfCars = await cars.countDocuments();
    
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

    static async updateMOT(carId, motStartDate, motEndDate) {
        try {
            const updateResponse = await cars.updateOne(
                { _id: ObjectId(carId) },
                { $set: { mot: { start_date: motStartDate, end_date: motEndDate } } }
            );
 
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update MOT: ${e}`);
        
        return { error: e };
        }
    }

    static async updateRT(carId, rtStartDate, rtEndDate) {
        try {
            const updateResponse = await cars.updateOne(
                { _id: ObjectId(carId) },
                { $set: { road_tax: { start_date: rtStartDate, end_date: rtEndDate } } }
            );
 
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update RT: ${e}`);
        
        return { error: e };
        }
    }

    static async getCarById(id) {
        try {
            const pipeline = [
                {
                    $match: {
                        _id: new ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: "rentals",
                        let: {
                            id: "$_id"
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$car_id", "$$id"]
                                    }
                                }
                            },
                            {
                                $sort: {
                                    date: -1
                                }
                            }
                        ],
                        as: "rentals"
                    }
                },
                {
                    $addFields: {
                        rentals: "$rentals"
                    }
                }
            ]
            return await cars.aggregate(pipeline).next();
        } catch (e) {
            console.error(`Something went wrong in getCarById: ${e}`);
            throw e;
        }
    }

    static async addCar(make, model, numberPlate, mot, road_tax) {
        try {
            const car = { 
                make: make,
                model: model,
                number_plate: numberPlate,
                mot: {
                    start_date: mot.start_date,
                    end_date: mot.end_date
                },
                road_tax: {
                    start_date: road_tax.start_date,
                    end_date: road_tax.end_date
                }
            };
 
            return await cars.insertOne(car);
        } catch (e) {
            console.error(`Unable to add review: ${e}`);
     return { error: e };
        }
    }
}

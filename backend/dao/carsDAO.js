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
    
    static async getRentalCars({} = {}) {
        let query;

        query = {"deleted": { $eq: false }, "type": { $eq: "rental" } }

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
                },
                {
                    $match: {
                        deleted: false,
                        type: "rental"
                    }
                }
            ]
            
            cursor = await cars.aggregate(pipeline);

        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return { carList: [], totalNumberOfCars: 0 }
        }
        
        try {
            const carList = await cursor.toArray();
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

        query = {"mot.end_date" : { $gte : currentDate, $lte: currentDateTwoWeeks }, "deleted": { $eq: false }, "type": { $eq: "rental" } }

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

        query = {"road_tax.end_date" : { $gte : currentDate, $lte: currentDateTwoWeeks }, "deleted": { $eq: false }, "type": { $eq: "rental" } }

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

    static async getRentalCarById(id) {
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

    static async addCar(make, model, numberPlate, mot, road_tax, deleted, type, rented, hasActiveRepair) {
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
                },
                deleted: deleted,
                type: type,
                rented: rented,
                has_active_repair: hasActiveRepair
            };
 
            return await cars.insertOne(car);
        } catch (e) {
            console.error(`Unable to add review: ${e}`);
     return { error: e };
        }
    }

    static async getActiveRentalCars({} = {}) {
        let query;

        query = {"deleted": { $eq: false }, "type": { $eq: "rental" } }

        let cursor;
    
        try {
            const currentDate = new Date();
            const pipeline = [
                {
                    "$lookup": {
                        "from": "rentals",
                        "let": {
                            "rId": "$_id"
                        },
                        "pipeline": [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [ "$car_id", "$$rId" ]
                                    },
                                    "dates.start_date": { $lte: currentDate },
                                    "dates.end_date": { $gte: currentDate }
                                }
                            }
                        ],
                        "as": "rentals"
                    }
                },
                {
                    $match: {
                        deleted: false,
                        type: "rental"
                    }
                }
            ]
            
            cursor = await cars.aggregate(pipeline);

        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return { carList: [], totalNumberOfCars: 0 }
        }
        
        try {
            const carList = await cursor.toArray();
            const totalNumberOfCars = await cars.countDocuments(query);
    
            return { carList, totalNumberOfCars }
        } catch(e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { carList: [], totalNumberOfCars: 0 }
        } 
    }

    static async getInactiveRentalCars({} = {}) {
        let query;

        query = {"deleted": { $eq: false }, "type": { $eq: "rental" } }

        let cursor;
    
        try {
            const currentDate = new Date();
            const pipeline = [
                {
                    "$lookup": {
                        "from": "rentals",
                        "let": {
                            "rId": "$_id"
                        },
                        "pipeline": [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [ "$car_id", "$$rId" ]
                                    },
                                    $or: [{ "dates.end_date": { $lt: currentDate } }, { "dates.start_date": { $gt: currentDate } }]
                                }
                            }
                        ],
                        "as": "rentals"
                    }
                },
                {
                    $match: {
                        deleted: false,
                        type: "rental"
                    }
                }
            ]
            
            cursor = await cars.aggregate(pipeline);

        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return { carList: [], totalNumberOfCars: 0 }
        }
        
        try {
            const carList = await cursor.toArray();
            const totalNumberOfCars = await cars.countDocuments(query);
    
            return { carList, totalNumberOfCars }
        } catch(e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { carList: [], totalNumberOfCars: 0 }
        } 
    }

    static async getExpiringRentals({} = {}) {
        let query;

        query = {"deleted": { $eq: false }, "type": { $eq: "rental" } }

        let cursor;
    
        try {
            const currentDate = new Date();
            const currentDateToChange = new Date(); // Using this as a provisional variable as the line below changes its value.
            const currentDateTwoWeeks = new Date(currentDateToChange.setDate(currentDateToChange.getDate() + 14));
            const pipeline = [
                {
                    "$lookup": {
                        "from": "rentals",
                        "let": {
                            "rId": "$_id"
                        },
                        "pipeline": [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [ "$car_id", "$$rId" ]
                                    },
                                    "dates.end_date": { $gte: currentDate, $lte: currentDateTwoWeeks }
                                }
                            }
                        ],
                        "as": "rentals"
                    }
                },
                {
                    $match: {
                        deleted: false,
                        type: "rental"
                    }
                }
            ]
            
            cursor = await cars.aggregate(pipeline);

        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return { carList: [], totalNumberOfCars: 0 }
        }
        
        try {
            const carList = await cursor.toArray();
            const totalNumberOfCars = await cars.countDocuments(query);
    
            return { carList, totalNumberOfCars }
        } catch(e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { carList: [], totalNumberOfCars: 0 }
        } 
    }

    static async deleteCar(carId, deleted) {
        try {
            const updateResponse = await cars.updateOne(
                { _id: ObjectId(carId) },
                { $set: { 
                        deleted: deleted
                    }
                }
            );
 
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update car in DAO: ${e}`);
        
        return { error: e };
        }
    }

    static async getRepairCars({} = {}) {
        let query;

        query = {"deleted": { $eq: false }, "type": { $eq: "repair" } }

        let cursor;
        
        try {
            const pipeline = [
                {
                    $lookup: {
                        from: 'repairs',
                        localField: "_id",
                        foreignField: "car_id",
                        as: "repairs"
                    }
                },
                {
                    $unwind: {
                        path: '$repairs',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'spare_parts',
                        localField: 'repairs._id',
                        foreignField: 'repair_id',
                        as: 'repairs.spare_parts'
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        make: { $first: '$make' },
                        model: { $first: '$model' },
                        number_plate: { $first: '$number_plate' },
                        repairs: { $push: '$repairs' },
                        mot: { $first: '$mot' },
                        road_tax: { $first: '$road_tax' },
                        type: { $first: '$type' },
                        deleted: { $first: '$deleted' },
                        rented: { $first: '$rented' },
                        has_active_repair: { $first: '$has_active_repair' }
                    }
                },
                {
                    $match: {
                        deleted: false,
                        type: "repair"
                    }
                }
            ]
            
            cursor = await cars.aggregate(pipeline);

        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return { carList: [], totalNumberOfCars: 0 }
        }
        
        try {
            const carList = await cursor.toArray();
            const totalNumberOfCars = await cars.countDocuments(query);
    
            return { carList, totalNumberOfCars }
        } catch(e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { carList: [], totalNumberOfCars: 0 }
        } 
    }

    static async getActiveRepairCars({} = {}) {
        let query;

        query = {"deleted": { $eq: false }, "type": { $eq: "repair" } }

        let cursor;
    
        try {
            const currentDate = new Date();

            const pipeline = [
                {
                    $lookup: {
                        from: 'repairs',
                        localField: "_id",
                        foreignField: "car_id",
                        as: "repairs"
                    }
                },
                {
                    $unwind: {
                        path: '$repairs'
                    }
                },
                {
                    $lookup: {
                        from: 'spare_parts',
                        localField: 'repairs._id',
                        foreignField: 'repair_id',
                        as: 'repairs.spare_parts'
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        make: { $first: '$make' },
                        model: { $first: '$model' },
                        number_plate: { $first: '$number_plate' },
                        repairs: { $push: '$repairs' },
                        mot: { $first: '$mot' },
                        road_tax: { $first: '$road_tax' },
                        type: { $first: '$type' },
                        deleted: { $first: '$deleted' }
                    }
                },
                {
                    $match: {
                        deleted: false,
                        type: "repair"                      
                    }
                },
                {
                    $project: {
                        _id: 1,
                        make: 1,
                        model: 1,
                        number_plate: 1,
                        mot: 1,
                        road_tax: 1,
                        type: 1,
                        deleted: 1,
                        "repairs" : {
                            $filter : {
                                "input" : "$repairs",
                                "as" : "repair",
                                "cond" : {
                                    $and: [
                                        {"$lte" : ["$$repair.repair_details.received_date", currentDate]},
                                        {"$gte" : ["$$repair.repair_details.due_date", currentDate]}
                                    ]
                                }
                            }
                        }
                    }
                }
            ]
            
            cursor = await cars.aggregate(pipeline);

        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return { carList: [], totalNumberOfCars: 0 }
        }
        
        try {
            const carList = await cursor.toArray();
            const totalNumberOfCars = await cars.countDocuments(query);
    
            return { carList, totalNumberOfCars }
        } catch(e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { carList: [], totalNumberOfCars: 0 }
        } 
    }

    static async getInactiveRepairCars({} = {}) {
        let query;

        query = {"deleted": { $eq: false }, "type": { $eq: "repair" } }

        let cursor;
    
        try {
            const currentDate = new Date();
            const pipeline = [
                {
                    $lookup: {
                        from: 'repairs',
                        localField: "_id",
                        foreignField: "car_id",
                        as: "repairs"
                    }
                },
                {
                    $unwind: {
                        path: '$repairs'
                    }
                },
                {
                    $lookup: {
                        from: 'spare_parts',
                        localField: 'repairs._id',
                        foreignField: 'repair_id',
                        as: 'repairs.spare_parts'
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        make: { $first: '$make' },
                        model: { $first: '$model' },
                        number_plate: { $first: '$number_plate' },
                        repairs: { $push: '$repairs' },
                        mot: { $first: '$mot' },
                        road_tax: { $first: '$road_tax' },
                        type: { $first: '$type' },
                        deleted: { $first: '$deleted' }
                    }
                },
                {
                    $match: {
                        deleted: false,
                        type: "repair"                      
                    }
                },
                {
                    $project: {
                        _id: 1,
                        make: 1,
                        model: 1,
                        number_plate: 1,
                        mot: 1,
                        road_tax: 1,
                        type: 1,
                        deleted: 1,
                        "repairs" : {
                            $filter : {
                                "input" : "$repairs",
                                "as" : "repair",
                                "cond" : {
                                    $or: [
                                        {"$gt" : ["$$repair.repair_details.received_date", currentDate]},
                                        {"$lt" : ["$$repair.repair_details.due_date", currentDate]}
                                    ]
                                }
                            }
                        }
                    }
                }
            ]
            
            cursor = await cars.aggregate(pipeline);

        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return { carList: [], totalNumberOfCars: 0 }
        }
        
        try {
            const carList = await cursor.toArray();
            const totalNumberOfCars = await cars.countDocuments(query);
    
            return { carList, totalNumberOfCars }
        } catch(e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { carList: [], totalNumberOfCars: 0 }
        } 
    }

    static async getRepairCarById(id) {
        try {
            const pipeline = [
                {
                    $match: {
                        _id: new ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: "repairs",
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
                                $lookup: {
                                    from: "spare_parts",
                                    let: { 
                                        "repairId": "$_id" 
                                    },
                                    pipeline: [
                                        { 
                                            $match: {
                                                $expr: {
                                                    $eq: ["$repair_id", "$$repairId"] 
                                                }
                                            }
                                        }
                                    ],
                                    "as": "spare_parts"
                                }
                            },{
                                $sort: {
                                    date: -1
                                }
                            }
                        ],
                        as: "repairs"
                    }
                },
                {
                    $addFields: {
                        repairs: "$repairs"
                    }
                }
            ]
            return await cars.aggregate(pipeline).next();
        } catch (e) {
            console.error(`Something went wrong in getCarById: ${e}`);
            throw e;
        }
    }

    static async updateCar(carId, rented) {
        try {
            const updateResponse = await cars.updateOne(
                { _id: ObjectId(carId) },
                { $set: { 
                        rented: rented
                    }
                }
            );
 
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update car in DAO: ${e}`);
        
        return { error: e };
        }
    }
}

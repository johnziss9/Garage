import mongodb from 'mongodb';
		 
const ObjectId = mongodb.ObjectId;

let spare_parts;

export default class SparePartsDAO {

    // This method will run as soon as the server starts and it connect to the database.
    static async injectDB(conn) {
        if (spare_parts) {
            return;
        }
        try {
            spare_parts = await conn.db(process.env.GARAGE_NS).collection("spare_parts");
        } catch (e) {
            console.error(`Unable to establish a collection in spare_partsDAO: ${e}`);
        }
    }

    static async addSparePart(repairId, name, cost, deleted) {
        try {
            const spare_part = { 
                repair_id: ObjectId(repairId),
                name: name,
                cost: cost,
                deleted: deleted
            };
 
            return await spare_parts.insertOne(spare_part);
        } catch (e) {
            console.error(`Unable to add spare part: ${e}`);
     return { error: e };
        }
    }

    static async getSpareParts({} = {}) {
        let query;

        query = {"deleted": { $eq: false }}

        let cursor;

        try {
            cursor = await spare_parts.find(query);
        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return { sparePartsList: [], totalNumberOfSpareParts: 0 }
        }

        try {
            const sparePartsList = await cursor.toArray();
            const totalNumberOfSpareParts = await spare_parts.countDocuments(query);

            return { sparePartsList, totalNumberOfSpareParts }
        } catch(e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { sparePartsList: [], totalNumberOfSpareParts: 0 }
        } 
    }

    static async deleteSparePart(sparePartId, deleted) {
        try {
            const updateResponse = await spare_parts.updateOne(
                { _id: ObjectId(sparePartId) },
                { $set: { 
                        deleted: deleted
                    }
                }
            );
 
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update spare part in DAO: ${e}`);
        
        return { error: e };
        }
    }

    static async updateSparePart(sparePartId, name, cost) {
        try {
            const updateResponse = await spare_parts.updateOne(
                { _id: ObjectId(sparePartId) },
                { $set: { 
                        name: name,
                        cost: cost
                    }
                }
            );
 
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update spare part in DAO: ${e}`);
        
        return { error: e };
        }
    }
}
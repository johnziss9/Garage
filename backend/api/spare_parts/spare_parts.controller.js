import SparePartsDAO from "../../dao/spare_partsDAO.js";

export default class SparePartsController {

    static async apiAddSparePart(req, res, next) {
        try {
            const repairId = req.body.repair_id;
            const name = req.body.name;
            const cost = req.body.cost;
            const deleted = req.body.deleted;
 
            const addSparePartResponse = await SparePartsDAO.addSparePart(
                repairId,
                name,
                cost,
                deleted
            );

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiGetSpareParts(req, res, next) {

        const { sparePartsList, totalNumberOfSpareParts } = await SparePartsDAO.getSpareParts();

        let response = {
            spare_parts: sparePartsList,
            total_results: totalNumberOfSpareParts

        };
        res.json(response);
    }

    static async apiDeleteSparePart(req, res, next) {
        try {
            const sparePartId = req.body.spare_part_id;
            const deleted = req.body.deleted;
 
            const sparePartResponse = await SparePartsDAO.deleteSparePart(
                sparePartId,
                deleted
            );
 
            var { error } = sparePartResponse;
            if (error) {
                res.status(400).json({ error });
            }
 
            if (sparePartResponse.modifiedCount === 0) {
                throw new Error("Unable to update the spare part in controller.")
            }
 
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateSparePart(req, res, next) {
        try {
            const sparePartId = req.body.spare_part_id;
            const name = req.body.name;
            const cost = req.body.cost;
 
            const sparePartResponse = await SparePartsDAO.updateSparePart(
                sparePartId,
                name,
                cost
            );
 
            var { error } = sparePartResponse;
            if (error) {
                res.status(400).json({ error });
            }
 
            if (sparePartResponse.modifiedCount === 0) {
                throw new Error("Unable to update the spare part in controller.")
            }
 
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}
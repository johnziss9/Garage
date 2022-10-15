import express from "express";
import cors from "cors";
import cars from "./api/cars/cars.route.js"; // This is the routes file we will create later 
import rentals from "./api/rentals/rentals.route.js";
import repairs from "./api/repairs/repairs.route.js";
import spare_parts from "./api/spare_parts/spare_parts.route.js";
import authentication from "./api/authentication/authentication.route.js"
 
const app = express();
 
app.use(cors());
app.use(express.json()); // This allows the server can accept and will be able to read json 
 
// Specify the initial url of the routes. The actual routes will be in another file. 
app.use("/api/cars", cars); // Specifying the url for the route and cars will be the file we add later. 
app.use("/api/rentals", rentals);
app.use("/api/repairs", repairs);
app.use("/api/spare_parts", spare_parts);
app.use("/api/authentication", authentication);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

// Deployment

const path = require("path");

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "/frontend/build")));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
    })
}
 
export default app;
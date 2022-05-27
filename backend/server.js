import express from "express";
import cors from "cors";
import cars from "./api/cars/cars.route.js"; // This is the routes file we will create later 
import rentals from "./api/rentals/rentals.route.js"; // This is the routes file we will create later 
 
const app = express();
 
app.use(cors());
app.use(express.json()); // This allows the server can accept and will be able to read json 
 
// Specify the initial url of the routes. The actual routes will be in another file. 
app.use("/api/cars", cars); // Specifying the url for the route and cars will be the file we add later. 
app.use("/api/rentals", rentals); 
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));
 
export default app;
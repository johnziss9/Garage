import app from './server.js';
import mongodb from "mongodb";
import dotenv from "dotenv";
import CarsDAO from './dao/carsDAO.js';
import RentalsDAO from './dao/rentalsDAO.js';

dotenv.config();
 
const MongoClient = mongodb.MongoClient;
const port = process.env.PORT || 8000;
 
MongoClient.connect(
    process.env.GARAGE_DB_URI,
    {
        maxPoolSize: 10, // max 10 people can connect
        wtimeoutMS: 2500,
        useNewUrlParser: true // parses the connection string
    }
)
.catch(err => {
    console.error(err.stack);
    process.exit(1)
})
// if there's no errors run the following code 
.then(async client => {
    await CarsDAO.injectDB(client);
    await RentalsDAO.injectDB(client);
    app.listen(port, () => {
        console.log(`listening to port ${port}`);
    });
})
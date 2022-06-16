// import mongodb from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
		 
// const ObjectId = mongodb.ObjectId;

let users;

export default class AuthenticationDAO {

    // This method will run as soon as the server starts and it connect to the database.
    static async injectDB(conn) {
        if (users) {
            return;
        }
        try {
            users = await conn.db(process.env.GARAGE_NS).collection("users");
        } catch (e) {
            console.error(`Unable to establish a collection in authenticationDAO: ${e}`);
        }
    }

    static async registerUser(username, password) {
        try {
            // Validate if user exist in our database
            const oldUser = await users.findOne({ username });

            if (oldUser) {
                return res.status(409).send("User Already Exist. Please Login");
            }

            //Encrypt user password
            const encryptedPassword = await bcrypt.hash(password, 10);

            const user = {
                username: username,
                password: encryptedPassword
            };

            // Create token
            const token = jwt.sign(
                { 
                    user_id: user._id, 
                    username 
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            
            // Save user token
            user.token = token;

            return await users.insertOne(user);
        } catch (e) {
            console.error(`Unable to add user: ${e}`);
            return { error: e };
        }
    }

    static async loginUser(username, password) {
        try {
            // Validate if user exist in our database
            const user = await users.findOne({ username });

            if (user && (await bcrypt.compare(password, user.password))) {
                // Create token
                const token = jwt.sign({ 
                    user_id: user._id,
                    username
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                });
            
                // save user token
                user.token = token;
            
                return await user;
            } else {
                return { status: 'Failed', error: 'Invalid credentials' };
            }
        } catch (e) {
            console.error(`Unable to add user: ${e}`);
            return { error: e };
        }
    }
}
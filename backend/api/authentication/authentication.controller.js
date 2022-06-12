import AuthenticationDAO from "../../dao/authenticationDAO.js";

export default class AuthenticationController {

    static async apiRegisterUser(req, res, next) {
        try {
            const username = req.body.username;
            const password = req.body.password;

            const registerResponse = await AuthenticationDAO.registerUser(
                username,
                password
            );

            var { error } = registerResponse;
            if (error) {
                res.status(400).json({ error });
            }
 
            if (registerResponse.modifiedCount === 0) {
                throw new Error("Unable to add user in controller.")
            }
 
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiLoginUser(req, res, next) {
        try {
            const username = req.body.username;
            const password = req.body.password;

            const loginResponse = await AuthenticationDAO.loginUser(
                username,
                password
            );

            var { error } = loginResponse;
            if (error) {
                res.status(400).json({ error });
            }
 
            if (loginResponse.modifiedCount === 0) {
                throw new Error("Unable to login user in controller.")
            }
 
            res.json(loginResponse);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}
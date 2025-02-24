const { query } = require("../config/database");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
// const { serect, urlAssets } = require("../config/config")
const serect = "e84b3b8d-3fc5-4ea8-941e-66e83b3fe449"
const urlAssets = "http://localhost:3000/uploads/"

const login = async (req, res) => {
    try {

        const { username, password } = req.body
        const user = await query("SELECT * FROM users WHERE username = ?", [username])
        if (!user.length) {
            return res.status(400).json({
                message: "Username not found!!"
            })
        }
        const match = await bcrypt.compare(password, user[0].password);
        if (!match) {
            return res.status(400).json({
                message: "Password invalid!!"
            })
        }

        const payload = { ...user[0] }; // Clone object เพื่อไม่ให้กระทบ original data
        delete payload.password;
        payload.image = urlAssets + payload.image

        const token = jwt.sign({ user: payload }, serect, { expiresIn: '12h' });

        res.json({
            user: payload,
            token: token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Database query failed", error
        })
    }
}

const profile = async (req, res) => {
    try {
        res.json(req.user)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Database query failed", error
        })
    }
}

module.exports = { login, profile }
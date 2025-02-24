const { query } = require("../config/database");
const util = require("util");
const upload = require("../utils/upload");
const uploadAsync = util.promisify(upload);
const bcrypt = require("bcrypt");
const { urlAssets } = require("../config/config");
const saltRounds = 10;

const getAllData = async (req, res) => {
    try {
        const results = await query("SELECT * FROM users")
        const users = results.map(item => ({
            ...item,
            image: urlAssets + item.image

        }))
        res.json(users)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Database query failed", error
        })
    }
}

const getOneData = async (req, res) => {
    try {
        const { id } = req.params
        const user = await query("SELECT * FROM users WHERE id = ?", [id])
        res.json(user)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Database query failed", error
        })
    }
}

const deleteData = async (req, res) => {
    try {
        const { id } = req.params
        const deleteUser = await query("DELETE FROM users WHERE id = ?", [id])
        res.json({
            message: "Delete data successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Database query failed", error
        })
    }
}

const updateData = async (req, res) => {
    try {
        try {
            // รอให้อัปโหลดเสร็จ
            await uploadAsync(req, res);

            const { id } = req.params
            const { first_name, last_name, phone, address, role } = req.body;

            if (!first_name || !last_name || !phone || !address || !role) {
                return res.status(400).json({
                    message: "first_name, last_name, phone, address, role is required"
                })
            }

            // ถ้าไม่มีไฟล์ที่อัปโหลด `req.file` จะเป็น undefined
            const imagePath = req.file ? req.file.filename : null;

            let sql;
            let value;
            if (imagePath) {
                sql = `
                UPDATE users SET first_name = ?, last_name = ?, phone = ?, address = ?, role = ?, image = ?
                WHERE id = ?
                `
                value = [first_name, last_name, phone, address, role, imagePath, id]
            } else {
                sql = `
                UPDATE users SET first_name = ?, last_name = ?, phone = ?, address = ?, role = ?
                WHERE id = ?
                `
                value = [first_name, last_name, phone, address, role, id]
            }
            // update
            await query(sql, value);

            // ส่ง response กลับ
            res.status(200).json({ message: "User created successfully" });

        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ message: "Database query failed", error: error.message });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Database query failed", error
        })
    }
}

const createData = async (req, res) => {
    try {
        // รอให้อัปโหลดเสร็จ
        await uploadAsync(req, res);

        const { first_name, last_name, username, password, phone, address, role } = req.body;
        if (!first_name || !last_name || !phone || !address || !role) {
            return res.status(400).json({
                message: "first_name, last_name, phone, address, role is required"
            })
        }
        // ตรวจสอบว่า username มีอยู่แล้วหรือไม่
        const checkUser = await query("SELECT * FROM users WHERE username = ?", [username]);
        if (checkUser.length >= 1) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // ถ้าไม่มีไฟล์ที่อัปโหลด `req.file` จะเป็น undefined
        const imagePath = req.file ? req.file.filename : null;

        // Hash password
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);

        const dateNow = new Date();

        // Insert ลงใน Database
        await query(`
            INSERT INTO users(first_name, last_name, username, password, phone, address, role, image, created_at)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [first_name, last_name, username, hash, phone, address, role, imagePath, dateNow]);

        // ส่ง response กลับ
        res.status(200).json({ message: "User created successfully" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Database query failed", error: error.message });
    }
};

module.exports = {
    getAllData,
    getOneData,
    deleteData,
    createData,
    updateData
}
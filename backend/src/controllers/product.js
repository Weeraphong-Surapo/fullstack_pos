
const multer = require("multer");
const upload = require("../utils/upload");
const { query } = require("../config/database");
const urlAssets = "http://localhost:3000/uploads/"

const createData = async (req, res) => {
    // ใช้ multer ในการอัพโหลดไฟล์
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            // Multer error (e.g., file too large)
            return res.status(400).json({ message: err.message });
        } else if (err) {
            // Other errors (e.g., invalid file type)
            return res.status(400).json({ message: err.message });
        }
        console.log("Uploaded file:", req.file);  // ตรวจสอบว่า req.file มีค่าหรือไม่

        const { name, price } = req.body;
        const imagePath = req.file ? req.file.filename : null;

        if (!name || !price) {
            return res.status(400).json({ message: "Name and price are required" });
        }

        if (!imagePath) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Save to the database
        const newProduct = await query("INSERT INTO products(name, price, img) VALUES(?, ?, ?)", [
            name, price, imagePath
        ]);

        res.status(200).json({
            message: "Product created successfully",
            data: newProduct
        });
    });
};


const getAllData = async (req, res) => {
    try {
        let { page } = req.query;
        page = parseInt(page); // แปลงค่า page เป็นตัวเลข
        const limit = 8;

        // ดึงจำนวนสินค้าทั้งหมด
        const totalCountResult = await query("SELECT COUNT(*) AS total FROM products");
        const totalProducts = totalCountResult[0].total;
        const totalPages = Math.ceil(totalProducts / limit); // คำนวณจำนวนหน้าทั้งหมด

        let queryStr = "SELECT * FROM products";
        let queryParams = [];

        // ถ้ามี page และเป็นตัวเลข ให้ใช้ LIMIT 8
        if (!isNaN(page) && page > 0) {
            const offset = (page - 1) * limit;
            queryStr += " LIMIT ? OFFSET ?";
            queryParams = [limit, offset];
        }

        // ดึงข้อมูลสินค้าตามเงื่อนไข
        const resultProducts = await query(queryStr, queryParams);

        // แปลง URL รูปภาพ
        const products = resultProducts.map((product) => ({
            ...product,
            img: urlAssets + product.img
        }));

        res.status(200).json({
            products,
            totalProducts,
            totalPages
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Database query failed', error });
    }
};





const deleteData = async (req, res) => {
    try {
        const { id } = req.params
        await query("DELETE FROM products WHERE id = ?", [id])
        res.status(200).json({
            message: "Delete Data Successfully"
        })
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
        const product = await query("SELECT * FROM products WHERE id = ?", [id])
        res.status(200).json(product)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Database query failed", error
        })
    }
}

const updateData = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            const { name, price } = req.body

            if (!name || !price) {
                return res.status(400).json({
                    message: "name and price is required",
                    body: req.body
                })
            }
            if (err instanceof multer.MulterError) {
                console.error("Multer error:", err);
                return res.status(400).json({ message: err.message });
            } else if (err) {
                console.error("Unknown error:", err);
                return res.status(400).json({ message: err.message });
            }

            const imagePath = req.file ? req.file.filename : null;



            const { id } = req.params

            let sql;
            let value;
            if (!imagePath) {
                sql = "UPDATE products SET name = ?, price = ? WHERE id = ?";
                value = [
                    name, price, id
                ]
            } else {
                sql = "UPDATE products SET name = ?, price = ?, img = ? WHERE id = ?";
                value = [
                    name, price, imagePath, id
                ]
            }
            const updateProduct = await query(sql, value)

            res.status(200).json({
                message: "Product updated successfully",
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Database query failed", error
        })
    }
}

module.exports = { createData, getAllData, deleteData, getOneData, updateData };

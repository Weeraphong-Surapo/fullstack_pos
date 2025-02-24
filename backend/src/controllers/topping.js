const { query } = require('../config/database'); // adjust path

const getAllData = async (req, res) => {
    try {
        const result = await query('SELECT * FROM toppings');
        res.json(result); // Send as JSON
    } catch (error) {
        res.status(500).send({ message: 'Database query failed', error });
    }
};

const getOneData = async (req, res) => {
    try {
        const { id } = req.params
        const result = await query("SELECT * FROM toppings WHERE id = ?", [id])
        res.json(result[0])
    } catch (error) {
        res.status(500).send({ message: 'Database query failed', error });
    }
}

const deleteData = async (req, res) => {
    try {
        const { id } = req.params
        await query("DELETE FROM toppings WHERE id = ?", [id])
        res.json({
            message: "Delete Data Successfully!"
        })
    } catch (error) {
        res.status(500).send({ message: 'Database query failed', error });
    }
}

const createData = async (req, res) => {
    try {
        const { name, price } = req.body
        const newData = await query("INSERT INTO toppings(name,price) VALUES(?,?)", [name, price])
        res.json({
            message: "Create Data Successfully!"
        })
    } catch (error) {
        console.log(error);

        res.status(500).send({ message: 'Database query failed', error });
    }
}

const updateData = async (req, res) => {
    try {
        const { name, price } = req.body
        const { id } = req.params
        const updateData = await query("UPDATE toppings SET name = ?, price = ? WHERE id = ?", [name, price, id])
        res.json({
            message: "Update Data Successfully!"
        })
    } catch (error) {
        res.status(500).send({ message: 'Database query failed', error });
    }
}

module.exports = {
    getAllData,
    getOneData,
    updateData,
    createData,
    deleteData
}
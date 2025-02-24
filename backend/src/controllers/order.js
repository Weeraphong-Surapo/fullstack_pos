const { query } = require("../config/database");
const { urlAssets } = require("../config/config")

const createData = async (req, res) => {
    try {
        const { id } = req.user
        const { order, payment, get_money, change_money } = req.body
        const dateNow = new Date();

        let order_id;

        const total_price_order = order.reduce((sum, item) => sum + item.total_price, 0);

        // เริ่มต้นการแทรกข้อมูลในตาราง orders
        const newOrder = await query(`
            INSERT INTO orders(order_date, total_price, user_id, payment, get_money, change_money) 
            VALUES(?, ?, ?, ?, ?, ?)
        `, [dateNow, total_price_order, id, payment, get_money, change_money]);

        order_id = newOrder.insertId

        // แทรกข้อมูลใน order_details
        for (const item of order) {
            const newOrderDetail = await query(`
                INSERT INTO order_details(order_id, product_id, size_id, quantity, price, type_id) 
                VALUES(?, ?, ?, ?, ?, ?)
            `, [
                newOrder.insertId,
                item.product_id,
                item.size_id,
                item.quantity,
                item.price,
                item.type_id
            ]);

            // แทรกข้อมูลในตาราง toppings (ถ้ามี)
            for (const toppingId of item.topping_id) {
                await query(`
                    INSERT INTO order_toppings(order_detail_id, topping_id)
                    VALUES(?, ?)
                `, [newOrderDetail.insertId, toppingId]);
            }
        }

        res.status(200).json({
            message: "Order created successfully!",
            order_id: order_id
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Database query failed",
            error: error.message
        });
    }
};

const getAllData = async (req, res) => {
    try {
        const resultOrders = await query(`
            SELECT 
            orders.id AS order_id,
            orders.total_price,
            orders.payment,
            orders.get_money,
            orders.change_money,
            orders.order_date,
            CONCAT('[', 
                GROUP_CONCAT(DISTINCT 
                    JSON_OBJECT(
                        'id', products.id,
                        'name', products.name,
                        'type', types.name,
                        'quantity' , order_details.quantity,
                        'size',sizes.size_name,
                        'toppings', 
                        (SELECT CONCAT('[', GROUP_CONCAT(DISTINCT 
                            JSON_OBJECT(
                                'id', toppings.id,
                                'name', toppings.name
                            )
                        ), ']') 
                        FROM order_toppings 
                        LEFT JOIN toppings ON order_toppings.topping_id = toppings.id
                        WHERE order_toppings.order_detail_id = order_details.id)
                    )
                ) 
            , ']') AS products,
            JSON_OBJECT(
                'id',users.id,
                'first_name',users.first_name,
                'last_name',users.last_name
            ) AS employee_sale
            FROM orders
            LEFT JOIN order_details ON orders.id = order_details.order_id
            LEFT JOIN products ON order_details.product_id = products.id
            LEFT JOIN sizes ON order_details.size_id = sizes.id
            LEFT JOIN types ON order_details.type_id = types.id
            LEFT JOIN users ON orders.user_id = users.id
            GROUP BY orders.id;
        `);

        const orders = resultOrders.map(order => ({
            ...order,
            employee_sale: order.employee_sale ? JSON.parse(order.employee_sale) : [],
            products: order.products ? JSON.parse(order.products).map(product => ({
                ...product,
                toppings: product.toppings ? JSON.parse(product.toppings) : []
            })) : []
        }));

        res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Database query failed",
            error: error.message
        });
    }
};


const deleteData = async (req, res) => {
    try {
        const { id } = req.params
        await query("DELETE FROM orders WHERE id = ?", [id])
        res.status(200).json({
            message: "Order Delete Successfully"
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
        const resultOrders = await query(`
            SELECT 
            orders.id AS order_id,
            orders.order_date,
            orders.total_price,
            orders.get_money,
            orders.change_money,
            CONCAT('[', 
                GROUP_CONCAT(DISTINCT 
                    JSON_OBJECT(
                        'id', products.id,
                        'name', products.name,
                        'type', types.name,
                        'size', sizes.size_name,
                        'price', order_details.price,
                        'quantity', order_details.quantity,
                        'toppings', 
                        (SELECT CONCAT('[', GROUP_CONCAT(DISTINCT 
                            JSON_OBJECT(
                                'id', toppings.id,
                                'name', toppings.name
                            )
                        ), ']') 
                        FROM order_toppings 
                        LEFT JOIN toppings ON order_toppings.topping_id = toppings.id
                        WHERE order_toppings.order_detail_id = order_details.id)
                    )
                ) 
            , ']') AS products,
            JSON_OBJECT(
                'id',users.id,
                'first_name',users.first_name,
                'last_name',users.last_name
            ) AS employee_sale
            FROM orders
            LEFT JOIN order_details ON orders.id = order_details.order_id
            LEFT JOIN products ON order_details.product_id = products.id
            LEFT JOIN sizes ON order_details.size_id = sizes.id
            LEFT JOIN types ON order_details.type_id = types.id
            LEFT JOIN users ON orders.user_id = users.id
            WHERE orders.id = ?
            GROUP BY orders.id
        `, [id]);

        const order = resultOrders.map(order => ({
            ...order,
            employee_sale: order.employee_sale ? JSON.parse(order.employee_sale) : null,
            products: order.products ? JSON.parse(order.products).map(product => ({
                ...product,
                toppings: product.toppings ? JSON.parse(product.toppings) : []
            })) : []
        }));

        res.status(200).json(order[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Database query failed", error
        })
    }
}

module.exports = {
    createData,
    deleteData,
    getAllData,
    getOneData
}
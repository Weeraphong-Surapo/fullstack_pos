const PdfPrinter = require("pdfmake");
const path = require("path");
const { query } = require("../config/database");

const getReceipt = async (req, res) => {
    try {
        const { id } = req.params;
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
                        'quantity', order_details.quantity,
                        'price', order_details.price,
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
                'id', users.id,
                'first_name', users.first_name,
                'last_name', users.last_name
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

        // จัดรูปแบบข้อมูล
        const orders = resultOrders.map(order => ({
            ...order,
            employee_sale: order.employee_sale ? JSON.parse(order.employee_sale) : null,
            products: order.products ? JSON.parse(order.products).map(product => ({
                ...product,
                toppings: product.toppings ? JSON.parse(product.toppings) : []
            })) : []
        }));

        if (!orders.length) {
            return res.status(404).json({ message: "ไม่พบคำสั่งซื้อ" });
        }

        const order = orders[0];

        // โหลดฟอนต์ภาษาไทย
        const fonts = {
            THSarabun: {
                normal: path.join(__dirname, "../fonts", "THSarabunNew.ttf"),
                bold: path.join(__dirname, "../fonts", "THSarabunNew-Bold.ttf"),
            },
        };

        const printer = new PdfPrinter(fonts);

        // 🛒 สร้างรายการสินค้าแบบ dynamic
        const productItems = order.products.map(product => {
            // Create a comma-separated string for toppings if any exist
            const toppingsText = product.toppings.length > 0 ?
                `( ${product.toppings.map(topping => topping.name).join(", ")} )` :
                ''; // Join multiple toppings with commas if more than one

            return {
                columns: [
                    { text: `${product.name} ${product.size} ${product.type} ${toppingsText}`, fontSize: 12, alignment: 'left', font: "THSarabun" },
                    { text: `${product.quantity}`, fontSize: 12, alignment: 'right', font: "THSarabun" },
                    { text: `${(product.quantity * product.price).toFixed(2)} บาท`, fontSize: 12, alignment: 'right', font: "THSarabun" }, // Calculate the total price for the product
                ]
            };
        });




        // 📝 สร้างใบเสร็จ
        const docDefinition = {
            content: [
                { text: "ร้าน BIG 24 SHOP", fontSize: 20, bold: true, alignment: 'center', font: "THSarabun" },
                { text: `เลขที่ใบเสร็จ: ${order.order_id}`, fontSize: 12, alignment: 'center', font: "THSarabun" },
                { text: `วันที่: ${new Date(order.order_date).toLocaleDateString()}`, fontSize: 12, alignment: 'center', font: "THSarabun" },
                { text: "\n", fontSize: 12, font: "THSarabun" }, // เพิ่มช่องว่าง

                // 🛒 หัวตารางสินค้า
                {
                    columns: [
                        { text: "สินค้า", fontSize: 12, alignment: 'left', bold: true, font: "THSarabun" },
                        { text: "จำนวน", fontSize: 12, alignment: 'right', bold: true, font: "THSarabun" },
                        { text: "ราคา", fontSize: 12, alignment: 'right', bold: true, font: "THSarabun" },
                    ]
                },

                // 🛒 รายการสินค้า
                ...productItems,


                { text: "\n", fontSize: 12, font: "THSarabun" },  // เพิ่มช่องว่าง

                // ✅ ยอดรวม
                {
                    columns: [
                        { text: "ยอดรวม", fontSize: 14, alignment: 'right', bold: true, font: "THSarabun" },
                        { text: `${order.total_price} บาท`, fontSize: 14, alignment: 'right', bold: true, font: "THSarabun" } // ใส่ยอดรวมจริง
                    ]
                },

                { text: "\n", fontSize: 12, font: "THSarabun" },  // เพิ่มช่องว่าง
                { text: "ขอบคุณที่ใช้บริการ", fontSize: 12, alignment: 'center', font: "THSarabun" },
                { text: "------------------------------", fontSize: 12, alignment: 'center', font: "THSarabun" },
                // { text: "© 2025 7-Eleven", fontSize: 10, alignment: 'center', font: "THSarabun" }
            ],
            pageMargins: [10, 10, 10, 10],
        };

        // 🖨️ สร้าง PDF
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'inline; filename="receipt.pdf"');

        pdfDoc.pipe(res);
        pdfDoc.end();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Database query failed",
            error: error.message
        });
    }
};


const getReportDashboard = async (req, res) => {
    try {
        const { year, month } = req.body

        // รวมยอดขายตามปีและเดือนที่กำหนด
        const resultTotalPrice = await query(
            `SELECT COALESCE(SUM(total_price), 0) as total_price 
         FROM orders 
         WHERE YEAR(order_date) = ? AND MONTH(order_date) = ?`,
            [year, month]
        );
        const totalPrice = resultTotalPrice[0]?.total_price || 0;

        // รวมยอดขายของการชำระเงินแบบ "CASH"
        const resultTotalPriceCash = await query(
            `SELECT COALESCE(SUM(total_price), 0) as total_price_cash 
         FROM orders 
         WHERE payment = 'CASH'
         AND YEAR(order_date) = ? AND MONTH(order_date) = ?
         `, [year, month]
        );
        const totalPriceCash = resultTotalPriceCash[0]?.total_price_cash || 0;

        // รวมยอดขายของการชำระเงินแบบ "QRCODE"
        const resultTotalPriceQrcode = await query(
            `SELECT COALESCE(SUM(total_price), 0) as total_price_qrcode 
         FROM orders 
         WHERE payment = 'QRCODE'
         AND YEAR(order_date) = ? AND MONTH(order_date) = ?
         `, [year, month]
        );
        const totalPriceQrcode = resultTotalPriceQrcode[0]?.total_price_qrcode || 0;

        // รายได้รายวัน
        const orderPerDays = await query(`
        SELECT DATE(order_date) AS order_date, SUM(total_price) AS total_price_per_day
        FROM orders
        WHERE YEAR(order_date) = ? AND MONTH(order_date) = ?
        GROUP BY DATE(order_date)
        ORDER BY order_date ASC
    `, [year, month]);

        // นับจำนวนสินค้า, ออเดอร์, และผู้ใช้ (ตัวอย่าง)
        const countProducts = await query("SELECT COUNT(*) as count FROM products");
        const countOrders = await query("SELECT COUNT(*) as count FROM orders");
        const countUsers = await query("SELECT COUNT(*) as count FROM users");

        const resultYears = await query("SELECT DISTINCT YEAR(order_date) AS year FROM orders ORDER BY year DESC");

        res.json({
            countProducts: countProducts[0]?.count || 0,
            countOrders: countOrders[0]?.count || 0,
            countUsers: countUsers[0]?.count || 0,
            totalPrice,
            totalPriceCash,
            totalPriceQrcode,
            orderPerDays,
            optionYears: resultYears.map(row => row.year)
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Database query failed", error
        })
    }
}

module.exports = {
    getReceipt,
    getReportDashboard
};

const { getAllData, createData, getOneData, deleteData } = require("../controllers/order")
const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")
const { validationResult } = require("express-validator");
const { validateOrder } = require("../validators/orderValidator"); // นำเข้าการตรวจสอบจากไฟล์

const router = require("express").Router()

router.get("/order", authMiddleware, roleMiddleware(['EMPLOYEE', 'ADMIN']), getAllData)
router.get("/order/:id", authMiddleware, roleMiddleware(['EMPLOYEE', 'ADMIN']), getOneData)
router.post("/order", authMiddleware, roleMiddleware(['ADMIN', 'EMPLOYEE']), validateOrder, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, createData)
router.delete("/order/:id", authMiddleware, roleMiddleware(['EMPLOYEE', 'ADMIN']), deleteData)

module.exports = router
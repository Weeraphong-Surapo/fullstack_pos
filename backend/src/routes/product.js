const { createData, getAllData, deleteData, getOneData, updateData } = require("../controllers/product")
const router = require("express").Router()
const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")

router.post("/product",authMiddleware, roleMiddleware(['EMPLOYEE', 'ADMIN']), createData)
router.get("/product", authMiddleware, roleMiddleware(['ADMIN']), getAllData)
router.delete("/product/:id", authMiddleware, roleMiddleware(['EMPLOYEE', 'ADMIN']), deleteData)
router.get("/product/:id", authMiddleware, roleMiddleware(['ADMIN']), getOneData)
router.put("/product/:id", authMiddleware, roleMiddleware(['EMPLOYEE', 'ADMIN']), updateData)

module.exports = router
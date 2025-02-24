const { getAllData, getOneData, createData, deleteData, updateData } = require("../controllers/user")
const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")
const { validateUser } = require("../validators/userValidator")
const { validationResult } = require("express-validator");
const router = require("express").Router()

router.get("/user", authMiddleware, roleMiddleware(['ADMIN']), getAllData)
router.get("/user/:id", authMiddleware, roleMiddleware(['ADMIN']), getOneData)
router.post("/user", createData)
router.put("/user/:id", updateData)
router.delete("/user/:id", authMiddleware, roleMiddleware(['ADMIN']), deleteData)

module.exports = router
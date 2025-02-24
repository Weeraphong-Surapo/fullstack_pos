const { getAllData, getOneData, createData, updateData, deleteData } = require("../controllers/size")
const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")
const { validateSize } = require("../validators/sizeValidator")
const { validationResult } = require("express-validator");

const router = require("express").Router()

router.get("/size", authMiddleware, roleMiddleware(['ADMIN', 'EMPLOYEE']), getAllData)
router.get("/size/:id", authMiddleware, roleMiddleware(['ADMIN', 'EMPLOYEE']), getOneData)
router.post("/size", authMiddleware, roleMiddleware(['ADMIN']), validateSize, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, createData)
router.put("/size/:id", authMiddleware, roleMiddleware(['ADMIN']), validateSize, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, authMiddleware, roleMiddleware(['ADMIN']), updateData)
router.delete("/size/:id", authMiddleware, roleMiddleware(['ADMIN']), deleteData)

module.exports = router
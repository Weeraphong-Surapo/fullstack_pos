const { getAllData, getOneData, createData, updateData, deleteData } = require("../controllers/type")
const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")
const { validateType } = require("../validators/typeValidator")
const { validationResult } = require("express-validator");

const router = require("express").Router()

router.get("/type", authMiddleware, roleMiddleware(['ADMIN']), getAllData)
router.get("/type/:id", authMiddleware, roleMiddleware(['ADMIN']), getOneData)
router.post("/type", authMiddleware, roleMiddleware(['ADMIN']), validateType, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, createData)
router.put("/type/:id", authMiddleware, roleMiddleware(['ADMIN']), validateType, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, updateData)
router.delete("/type/:id", authMiddleware, roleMiddleware(['ADMIN']), deleteData)

module.exports = router
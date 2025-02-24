const { getAllData, getOneData, createData, updateData, deleteData } = require("../controllers/topping")
const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")
const { validateTopping } = require("../validators/toppingValidator")
const { validationResult } = require("express-validator");

const router = require("express").Router()

router.get("/topping", authMiddleware, roleMiddleware(['ADMIN', 'EMPLOYEE']), getAllData)
router.get("/topping/:id", authMiddleware, roleMiddleware(['ADMIN', 'EMPLOYEE']), getOneData)
router.post("/topping", authMiddleware, roleMiddleware(['ADMIN']), validateTopping, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, createData)
router.put("/topping/:id", authMiddleware, roleMiddleware(['ADMIN']), validateTopping, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, updateData)
router.delete("/topping/:id", authMiddleware, roleMiddleware(['ADMIN']), deleteData)

module.exports = router
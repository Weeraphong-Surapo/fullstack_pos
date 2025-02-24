const { login, profile } = require("../controllers/auth")
const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")
const { validationResult } = require("express-validator");
const { validateLogin } = require("../validators/authValidator"); // นำเข้าการตรวจสอบจากไฟล์

const router = require("express").Router()

router.post("/login", validateLogin, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, login)
router.get("/profile", authMiddleware, roleMiddleware(['EMPLOYEE', 'ADMIN']), profile)

module.exports = router
const { getReceipt, getReportDashboard } = require("../controllers/report")
const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")
const router = require("express").Router()

router.get("/report-receipt/:id",  getReceipt)
router.post("/report-dashboard", authMiddleware, roleMiddleware(['ADMIN']), getReportDashboard)

module.exports = router
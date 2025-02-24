const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const morgan = require("morgan")
const path = require("path")
const productRoute = require("./routes/product")
const sizeRoute = require("./routes/size")
const authRoute = require("./routes/auth")
const orderRoute = require("./routes/order")
const reportRoute = require("./routes/report")
const toppingRoute = require("./routes/topping")
const typeRoute = require("./routes/type")
const userRoute = require("./routes/user")

const app = express();
const port = 3000;

app.use(cors());

// Enable CORS with specific options (e.g., only allow specific origins)
app.use(cors({
    origin: 'https://frontpos.shopcurations.shop',  // Replace with your front-end origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
}));

app.use(morgan("dev"))

// ตั้งค่า multer สำหรับการรับไฟล์
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// ใช้ body-parser สำหรับ JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", productRoute)
app.use("/api", sizeRoute)
app.use("/api", authRoute)
app.use("/api", orderRoute)
app.use("/api", reportRoute)
app.use("/api", toppingRoute)
app.use("/api", typeRoute)
app.use("/api", userRoute)

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

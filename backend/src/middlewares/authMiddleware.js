const jwt = require('jsonwebtoken');
const serect = "e84b3b8d-3fc5-4ea8-941e-66e83b3fe449"


const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), serect);
        req.user = decoded.user; // เก็บข้อมูล user ไว้ใน req.user
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

module.exports = authMiddleware;

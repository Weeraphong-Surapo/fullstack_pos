// validators/authValidator.js
const { body } = require("express-validator");

const validateLogin = [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
];

module.exports = { validateLogin };

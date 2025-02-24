const { body } = require("express-validator");

const validateSize = [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').notEmpty().withMessage('Price is required')
];

module.exports = { validateSize };

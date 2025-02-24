const { body } = require("express-validator");

const validateTopping = [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').notEmpty().withMessage('Price is required')
];

module.exports = { validateTopping };

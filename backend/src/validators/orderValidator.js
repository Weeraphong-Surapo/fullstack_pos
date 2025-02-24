const { body } = require("express-validator");

const validateOrder = [
    body('payment').notEmpty().withMessage('payment is required'),
    body('get_money').notEmpty().withMessage('get_money is required'),
    body('change_money').notEmpty().withMessage('change_money is required'),
    body('order').notEmpty().withMessage('order is required'),
];

module.exports = { validateOrder };

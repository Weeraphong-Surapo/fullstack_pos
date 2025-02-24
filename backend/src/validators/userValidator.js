const { body } = require("express-validator");


const validateUser = [
    body('first_name').notEmpty().withMessage('first_name is required'),
    body('last_name').notEmpty().withMessage('last_name is required'),
    body('username').notEmpty().withMessage('username is required'),
    body('password').notEmpty().withMessage('password is required'),
    body('phone').notEmpty().withMessage('phone is required'),
    body('address').notEmpty().withMessage('address is required'),
    body('role').notEmpty().withMessage('role is required'),
    // body('price').notEmpty().withMessage('Price is required')
];

module.exports = { validateUser };

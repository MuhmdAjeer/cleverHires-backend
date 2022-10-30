const {check} = require('express-validator')


module.exports = {
    validateSignup : [
        check('email')
        .exists().withMessage('Provide Email address')
        .isEmail().withMessage('Invalid Email'),

        check('firstName')
        .exists().withMessage('Provide Firstname')
        .isLength({min:3}).withMessage('Must be 3 characters long'),

        check('lastName')
        .exists().withMessage('Provide Lastname'),
        
        check('password')
        .exists().withMessage('Passwords cant be blank')
        .isLength({min : 8}).withMessage('Must be 8 characters long'),

        check('phone')
        .exists().withMessage("phone cant be blank")
        .isNumeric().withMessage('only numbers are allowed')
        .isLength({min:10,max:10}).withMessage('Provide a valid phone number')

    ]
}
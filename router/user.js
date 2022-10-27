const router = require('express').Router()

const {signup, verifyOtp} = require('../controller/authController')
const {validateSignup} = require('../Middlewares/validation')


//Auth
router.post('/signin',validateSignup,signup);
router.post('/verifyotp',verifyOtp);

module.exports = router;

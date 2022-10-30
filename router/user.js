const router = require('express').Router()

const {signup, verifyOtp,signin} = require('../controller/authController')
const {validateSignup} = require('../Middlewares/validation')


//Auth
router.post('/signup',validateSignup,signup);
router.post('/verifyotp',verifyOtp);
router.post('/signin',signin)

module.exports = router;

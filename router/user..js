const router = require('express').Router()

const {signup} = require('../controller/authController')


//Auth
router.post('/signin',signup);

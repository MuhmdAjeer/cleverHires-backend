const { login } = require('../controller/admin.controller');

const router = require('express').Router();



router.post('/login',login)















module.exports = router;
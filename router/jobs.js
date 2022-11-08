const router = require("express").Router();
const { createHirer } = require("../controller/jobController");
const { verify } = require("../Middlewares/jwtVerification");

router.post("/hirer", verify, createHirer);

module.exports = router;

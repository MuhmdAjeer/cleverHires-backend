const router = require("express").Router();
const {
  createHirer,
  gethirer,
  getHirer,
} = require("../controller/jobController");
const { verify } = require("../Middlewares/jwtVerification");

router.route("/hirer").post(verify, createHirer).get(verify, getHirer);

module.exports = router;

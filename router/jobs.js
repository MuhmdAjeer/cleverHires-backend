const router = require("express").Router();
const {
  createHirer,
  gethirer,
  getHirer,
  postJob,
  getJobs
} = require("../controller/jobController");
const { verify } = require("../Middlewares/jwtVerification");

router.route('/')
  .post(verify,postJob)
  .get(getJobs)


router.route("/hirer").post(verify, createHirer).get(verify, getHirer);

module.exports = router;

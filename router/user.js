const router = require("express").Router();

const { signup, verifyOtp, signin } = require("../controller/authController");
const { uploadPost, getAllPosts } = require("../controller/userController");
const { verify } = require("../Middlewares/jwtVerification");
const { validateSignup } = require("../Middlewares/validation");

//Auth
router.post("/signup", validateSignup, signup);
router.post("/verifyotp", verifyOtp);
router.post("/signin", signin);

//Post
router.route("/post").post(verify, uploadPost);

router.route("/posts").get(getAllPosts);
router.route('/p').get((req,res)=>{
    res.json({name:'ajeer'})
})

module.exports = router;

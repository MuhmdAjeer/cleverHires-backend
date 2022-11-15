const router = require("express").Router();

const { signup, verifyOtp, signin } = require("../controller/authController");
const { uploadPost, getAllPosts , likePost , addComment} = require("../controller/userController");
const { verify } = require("../Middlewares/jwtVerification");
const { validateSignup } = require("../Middlewares/validation");

//Auth
router.post("/signup", validateSignup, signup);
router.post("/verifyotp", verifyOtp);
router.post("/signin", signin);

//Post
router.route("/post")
    .post(verify, uploadPost)

router.route('/post/like')
    .patch(verify,likePost)

router.route('/post/comment')
    .post(verify,addComment)

router.route("/posts")
    .get(getAllPosts);


module.exports = router;

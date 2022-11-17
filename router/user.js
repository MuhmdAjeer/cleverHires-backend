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
router.route("/posts")
    .post(verify, uploadPost)
    .get(getAllPosts);


router.patch('/posts/like',verify,likePost)
router.post('/posts/comment',verify,addComment)



module.exports = router;

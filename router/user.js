const router = require('express').Router()

const { signup, verifyOtp, signin } = require('../controller/authController')
const {uploadPost,getAllPosts,likePost,addComment,deletePost,getAllUsers, updateProfileImage,followUser,unFollowUser, addExperience , getProfile, updateAbout, getUser} = require('../controller/userController')
const { verify } = require('../Middlewares/jwtVerification')
const { validateSignup } = require('../Middlewares/validation')

//Auth
router.post('/signup', validateSignup, signup)
router.post('/verifyotp', verifyOtp)
router.post('/signin', signin)

//Post
router.route('/posts')
    .post(verify, uploadPost)
    .get(verify,getAllPosts)

router.route('/posts/:id').delete(verify, deletePost)

router.patch('/posts/like', verify, likePost)
router.post('/posts/comment', verify, addComment)

//users
router.get('/', getAllUsers )
router.get('/:id',getUser)
router.put('/follow/:id',verify,followUser)
router.put('/unfollow/:id',verify,unFollowUser)

router.get('/profile/:username',verify,getProfile)
router.put('/profile/image',verify,updateProfileImage)
router.post('/profile/experience',verify,addExperience)
router.put('/profile/about',verify,updateAbout)


module.exports = router

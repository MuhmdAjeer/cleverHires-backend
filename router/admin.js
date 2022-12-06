const { login , blockUser,getAllUsers} = require('../controller/admin.controller');
const { changeVisibility,getJobs} = require('../controller/admin.job');

const router = require('express').Router();



router.post('/login',login)
router.put('/users/:userId/block',blockUser)
router.get('/users',getAllUsers)
router.get('/jobs',getJobs)
router.put('/jobs/:id/visibility',changeVisibility)















module.exports = router;
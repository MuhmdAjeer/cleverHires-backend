const { login , blockUser,getAllUsers} = require('../controller/admin.controller');
const { changeVisibility,getJobs, getHirerRequests, approveHirer, declineHirer} = require('../controller/admin.job');

const router = require('express').Router();



router.post('/login',login)
router.put('/users/:userId/block',blockUser)
router.get('/users',getAllUsers)
router.get('/jobs',getJobs)
router.put('/jobs/:id/visibility',changeVisibility)
router.get('/jobs/hirer/requests',getHirerRequests)
router.put('/jobs/hirer/requests/:hirerId/approve',approveHirer)
router.put('/jobs/hirer/requests/:hirerId/decline',declineHirer)
router.put('/logout',logout)












module.exports = router;
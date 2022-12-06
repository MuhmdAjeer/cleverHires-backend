const router = require('express').Router()
const {gethirer,getHirer,postJob,getJobs,applyJob,getUserJobs,getJobApplications, requestToBeHirer, approveHirer} = require('../controller/jobController')
const { verify } = require('../Middlewares/jwtVerification')

router.route('/').post(verify, postJob).get(verify,getJobs)

router.post('/:jobId/apply',verify,applyJob)
router.get('/my-jobs',verify,getUserJobs)
router.get('/:jobId',verify,getJobApplications)

router.post('/hirer/request',verify, requestToBeHirer)
router.put('/hirer/:id/approve',approveHirer)

module.exports = router

const router = require('express').Router()
const {createHirer,gethirer,getHirer,postJob,getJobs,applyJob,getUserJobs,getJobApplications} = require('../controller/jobController')
const { verify } = require('../Middlewares/jwtVerification')

router.route('/').post(verify, postJob).get(verify,getJobs)

router.post('/:jobId/apply',verify,applyJob)
router.get('/my-jobs',verify,getUserJobs)
router.get('/:jobId',verify,getJobApplications)

// router.route('/hirer').post(verify, createHirer).get(verify, getHirer)

module.exports = router

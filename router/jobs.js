const router = require('express').Router()
const {
    createHirer,
    gethirer,
    getHirer,
    postJob,
    getJobs,
    applyJob
} = require('../controller/jobController')
const { verify } = require('../Middlewares/jwtVerification')

router.route('/').post(verify, postJob).get(getJobs)

router.post('/:jobId/apply',verify,applyJob)

// router.route('/hirer').post(verify, createHirer).get(verify, getHirer)

module.exports = router

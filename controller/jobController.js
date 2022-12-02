const { LoggerLevel } = require('mongodb')
const { isValidObjectId } = require('mongoose')
const Jobs = require('../database/jobs')
const User = require('../database/user')
const jobModel = require('../model/jobModel')
const userModel = require('../model/userModel')

exports.createHirer = async (req, res) => {
    const { id } = req.user
    const hirerDetails = req.body

    try {
        const user = await User.findById(id)
        if (user.hiring) {
            return res.status(403).json({
                message: 'already  applied to be a hirer',
            })
        }

        await Jobs.createHirer(hirerDetails, id)
        res.status(201).json({
            message: 'Request to be a hirer has succesfully sended',
        })
    } catch (error) {
        res.status(500)
    }
}

exports.getHirer = async (req, res) => {
    const { id } = req.user
    try {
        const hirer = await User.findById(id)

        if (!hirer?.hiring?.approved) {
            return res.status(200).json({
                hirer: false,
                message: 'first request to be a hirer',
            })
        }

        return res.status(200).json({
            hirer: true,
            details: hirer.hiring,
        })
    } catch (error) {
        res.stauts(500).json({ message: error.message })
    }
}

exports.postJob = async (req, res) => {
    try {
        const hirer = await User.findById(req.user.id)
        console.log(hirer)

        if (hirer?.hiring?.approved) {
            return res.status(403).json({
                message: 'Become a hirer to post job',
            })
        }

        let jobId
        req.body.hirer = hirer._id

        console.log(req.body)
        try {
            jobId = await Jobs.uploadJob(req.body)
            console.log(jobId)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ err })
        }

        return res.status(201).json({
            message: 'Job uploaded successfully',
            jobId,
        })
    } catch (error) {
        console.log('hello')
        res.status(500).json({ error: error.message })
    }
}

exports.getJobs = async (req, res) => {
    try {
        const userId = req.user.id
        const jobs = await jobModel.find({hirer: { $nin: [userId] } }).populate('hirer')

        if (!jobs.length) {
            return res.status(404).json({
                status: 'failed',
                message: 'No jobs found',
            })
        }
        
        res.status(200).json(jobs)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

exports.applyJob = async(req,res) => {
    try {

        const {jobId} = req.params
        if(!isValidObjectId(jobId)) {
            return res.status(400).json({
                success : false,
                message : 'Invalid Job Id'
            })
        }

        console.log(req.body);
        const { email,joiningTime,ctc,pdfUrl,phone } = req.body
        
        const application = {
            seeker : req.user.id,
            email : email,
            phone : phone,
            joiningTime : joiningTime,
            ctc : ctc,
            resume : pdfUrl
        }

        const job =  await jobModel.findByIdAndUpdate(jobId,{
            $push : {
                applications : application
            }
        })

        if(!job){
            return res.status(404).json({
                success : false,
                message : "No job found!"
            })
        }

        res.status(201).json({message : "Application success"})

    } catch (error) {
        res.status(500).json({
            error : error.message
        })
    }
}

exports.getUserJobs = async(req,res) => {
    try {
        const hirerId = req.user.id;
        if(!isValidObjectId(hirerId)){
            return res.status(400).json({message : 'Invalid userId passed'})
        }
        const jobs = await jobModel.find({hirer : hirerId}).select('-applications');
        return res.status(200).json(jobs)

    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

exports.getJobApplications = async(req,res)=>{
    try {
        const jobId = req.params.jobId;
        const userId = req.user.id
        if(!isValidObjectId(jobId)){
            return res.status(400).json({message : 'Invalid jobId'})
        }
        const job = await jobModel.findById(jobId).populate('applications.seeker')

        if(!job) return res.status(404).json({message : 'No job found!'})
        if(job.hirer != userId) return res.status(403).json({message : 'Cant access this job'})
        
        return res.status(200).json(job)

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

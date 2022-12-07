const { isValidObjectId } = require("mongoose")
const jobModel = require("../model/jobModel")
const userModel = require("../model/userModel")

exports.changeVisibility = async(req,res)=>{
    try {
        const jobId = req.params.id
        if(!isValidObjectId(jobId)){
            return res.status(400).json({
                message : 'Invalid JobId'
            })
        }
    
        const job = await jobModel.findById(jobId);
        if(!job) return res.status(404).json({
            message : 'No job found'
        })
        
        await job.updateOne({$set : {hidden : !job.hidden}})
        res.status(200).json({
            message : 'Visibility updated!'
        })
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

exports.getJobs = async(req,res)=>{
    try {
        const jobs = await jobModel.find({}).populate('hirer')
        return res.status(200).json(jobs)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

exports.getHirerRequests = async(req,res)=>{
    try {
        const requests = await userModel.find({'hiring.approved':false})
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({
            error : error.message
        })
    }
}
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

exports.approveHirer = async(req,res)=>{
    try {
        const {hirerId} = req.params;
        if(!isValidObjectId(hirerId)) return res.status(400).json({
            message : 'Invalid HirerId'
        })
        const hirer = await userModel.findById(hirerId)
        if(hirer.hirer){
            return res.status(403).json({
                message : 'Already a hirer!'
            })
        }
        if(!hirer.hiring) return res.status(409).json({
            message : 'User has not requested for being an hirer'
        })

        await hirer.update({$set : {hirer : true , 'hiring.approved' : true}})
        res.status(200).json({
            message : 'Approval success',
            success : true
        })
    } catch (error) {
        res.status(500).json({
            error : error.message
        })
    }
}

exports.declineHirer = async(req,res)=>{
    try {
        const {hirerId} = req.params;
        if(!isValidObjectId(hirerId)) return res.status(400).json({
            message : 'Invalid HirerId'
        })
        const hirer = await userModel.findById(hirerId)
        if(hirer.hirer){
            return res.status(403).json({
                message : 'Already a hirer!'
            })
        }
        if(!hirer.hiring) return res.status(409).json({
            message : 'User has not requested for being an hirer'
        })

        await hirer.update({$set : {'hiring.approved' : 'declined'}})
        
        res.status(200).json({
            message : 'Declining success',
            success : true
        })
    } catch (error) {
        res.status(500).json({
            error : error.message
        })
    }
}
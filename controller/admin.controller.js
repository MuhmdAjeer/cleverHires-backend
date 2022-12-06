const adminModel = require("../model/adminModel");
const bcrypt = require('bcrypt');
const { generateToken } = require("../utils/jwt");
const { isValidObjectId } = require("mongoose");
const userModel = require("../model/userModel");
const jobModel = require("../model/jobModel");


exports.login = async(req,res)=>{
    try {
        let {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message : 'Provide full credentials'})
        }
        const admin = await adminModel.findOne({email});
        if(!admin) return res.status(404).json({message:'No admin found!'})
        
        if(!(await bcrypt.compare(password,admin.password))){
           return res.status(400).json({message : 'Invalid Password'})
        }

        res.status(200).json({
            message : 'Login successfull',
            token : generateToken({admin:true})
        })
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

exports.blockUser = async(req,res)=>{
    try {
        const {userId} = req.params;
        if(!userId) return res.status(400).json({message : 'Provide userId'})
        if(!isValidObjectId(userId)) return res.status(400).json({message:'Invalid userId provided'})

        const user = await userModel.findById(userId)
        if(!user) return res.status(404).json({
            message : 'No user found with given userId'
        })
        await user.updateOne({$set : {blocked : !user.blocked}})

        res.status(200).json({
            message : `user's restriction updated successfully`
        })
    } catch (error) {
        
    }
}

exports.getAllUsers = async(req,res)=>{
    try {
        const users = await userModel.find({});
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}


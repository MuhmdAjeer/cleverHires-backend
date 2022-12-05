const adminModel = require("../model/adminModel");
const bcrypt = require('bcrypt');
const { generateToken } = require("../utils/jwt");

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
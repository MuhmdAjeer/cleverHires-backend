const { default: mongoose } = require('mongoose')

const schema = require('mongoose').Schema


const otpModel = new schema({

    email : {
        type : String,
        required:true
    },
    otp : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        required : true
    }
},{timestamps : true})


module.exports = mongoose.model('otp', otpModel);
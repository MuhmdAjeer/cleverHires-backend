const { default: mongoose } = require('mongoose')

const schema = require('mongoose').Schema
const { ObjectId } = mongoose.Schema.Types

const userModel = new schema(
    {
        email: {
            type: String,
            require: true,
        },
        password: {
            type: String,
            require: true,
        },
        firstName: {
            type: String,
            require: true,
        },
        lastName: {
            type: String,
            require: true,
        },
        username : {
            type : String,
            required: true
        },
        phone: {
            type: Number,
            require: true,
        },
        about : {
            type : String,
            default : ''
        },
        following : [{
            type : ObjectId,
            ref : 'users',
            default : []
        }],
        followers : [{
            type : ObjectId,
            ref : 'users',
            default : []
        }],
        connections : [{
            type : ObjectId,
            ref : 'users',
            default : []
        }],
        experiences : [{
            companyName : {
                type : String
            },
            title : {
                type : String
            },
            location : {
                type : String
            },
            currentRole : {
                type : Boolean
            },
            startMonth : {
                type : String
            },
            startYear : {
                type : String
            },
            endMonth : {
                type : String
            },
            endYear : {
                type : String
            }
            
        }]
    },
    { timestamps: true }
)

module.exports = mongoose.model('users', userModel)

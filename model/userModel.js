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
        phone: {
            type: Number,
            require: true,
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
        }]
    },
    { timestamps: true }
)

module.exports = mongoose.model('users', userModel)

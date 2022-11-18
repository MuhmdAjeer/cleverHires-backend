const { default: mongoose } = require('mongoose')

const schema = require('mongoose').Schema

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
    },
    { timestamps: true }
)

module.exports = mongoose.model('users', userModel)

const { default: mongoose } = require('mongoose')

const schema = require('mongoose').Schema

const adminModel = new schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('admin', adminModel)

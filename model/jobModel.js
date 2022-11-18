const { default: mongoose } = require('mongoose')

const schema = require('mongoose').Schema

const { ObjectId } = mongoose.Schema.Types

const jobModel = new schema(
    {
        hirer: {
            type: ObjectId,
            ref: 'users',
            required: true,
        },
        jobRole: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        workplace: {
            type: String,
            required: true,
        },
        employmentType: {
            type: String,
            required: true,
        },
        minimumExperience: {
            type: Number,
            required: true,
        },
        maximumExperience: {
            type: Number,
            required: true,
        },
        minSalary: {
            type: Number,
            required: true,
        },
        maxSalary: {
            type: Number,
            required: true,
        },
        skills: {
            type: Array,
            default: [],
        },
        description: {
            type: String,
            required: true,
        },
        vaccancies: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('jobs', jobModel)

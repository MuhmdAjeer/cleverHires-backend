const db = require('../config/connection')
const { USER, POST, HIRER, JOB } = require('./collections')
const bcrypt = require('bcrypt')
const { ObjectId, Timestamp } = require('mongodb')
const jobModel = require('../model/jobModel')
const userModel = require('../model/userModel')

module.exports = {
    //updaing user  document with hirer field
    createHirer: async (data, userId) => {
        return new Promise((resolve, reject) => {
            userModel.updateOne(
                { _id: userId },
                {
                    $set: {
                        hiring: {
                            approved: false,
                            ...data,
                        },
                    },
                }
            )
        })
            .then((response) => resolve(response))
            .catch((err) => reject(err))
    },

    //uploading a new job
    uploadJob: async (jobDetails) => {
        return new Promise((resolve, reject) => {
            jobModel
                .create(jobDetails)
                .then((response) => resolve(response))
                .catch((err) => reject(err))
        })
    },
}

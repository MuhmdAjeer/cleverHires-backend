const db = require("../config/connection");
const { USER, POST, HIRER, JOB } = require("./collections");
const bcrypt = require("bcrypt");
const { ObjectId, Timestamp } = require("mongodb");

module.exports = {

  //updaing user  document with hirer field
  createHirer: async (data, userId) => {
    await db.get().collection(USER).updateOne(
      { _id: ObjectId(userId) },
      {
        $set: {
          hiring: {
            approved: false,
            ...data,
          },
        },
      }
    );
  },

  //uploading a new job
  uploadJob: async (jobDetails, hirerId) => {
    try {
      const jobId = await db.get().collection(JOB).insertOne({
        hirer: ObjectId(hirerId),
        ...jobDetails,
        postedAt: Date.now()
      })
      return jobId.insertedId;
    } catch (error) {
      console.log(error);
    }
  }

};

const db = require("../config/connection");
const { USER, POST, HIRER } = require("./collections");
const bcrypt = require("bcrypt");
const { ObjectId, Timestamp } = require("mongodb");

module.exports = {
  createHirer: async (data, userId) => {
    await db
      .get()
      .collection(USER)
      .updateOne(
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
};

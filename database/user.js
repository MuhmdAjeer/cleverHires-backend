const db = require('../config/connection')
const { USER } = require('./collections')
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

module.exports = {
    findByEmail: async (email) => {
        try {
            const user = await db.get().collection(USER).findOne({ email: email })
            return user;
        } catch (error) {
            throw error
        }
    },
    insertUser: async (user) => {
        try {
            user.password = await bcrypt.hash(user.password, 10);
            const userDetails = await db.get().collection(USER).insertOne(user)
            return userDetails;
        } catch (error) {
            throw error
        }
    },
    findById: async (id) => {
        try {
            const user = await db.get().collection(USER).findOne({ _id: ObjectId(id) })
            return user
        } catch (error) {
            throw error
        }
    }
}
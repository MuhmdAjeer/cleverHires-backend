const db = require('../config/connection')
const { USER, POST } = require('./collections')
const bcrypt = require('bcrypt')
const { ObjectId, Timestamp } = require('mongodb')
const postModel = require('../model/postModel')
const userModel = require('../model/userModel')

exports.findByEmail = async (email) => {
    return new Promise((resolve, reject) => {
        userModel
            .findOne({ email })
            .then((response) => resolve(response))
            .catch((err) => reject(err))
    })
}

exports.insertUser = (user) => {
    return new Promise(async (resolve, reject) => {
        user.password = await bcrypt.hash(user.password, 10)
        userModel
            .create(user)
            .then((response) => resolve(response))
            .catch((err) => reject(err))
    })
}

exports.findById = async (id) => {
    return new Promise((resolve, reject) => {
        userModel
            .findOne({ _id: id })
            .then((response) => resolve(response))
            .catch((err) => reject(err))
    })
}

exports.uploadPost = async (post) => {
    return new Promise((resolve, reject) => {
        postModel
            .create(post)
            .then((response) => resolve(response))
            .catch((err) => resolve(err))
    })
}

exports.getFollowingPosts = async (userId) => {
    return new Promise(async(resolve, reject) => {

        const user = await userModel.findById(userId)
        console.log(user.following);

        postModel
            .find({user : {$in :[...user.following,userId]}})
            .populate('user', { password: 0 })
            .populate('comments.user', { password: 0 })
            .sort({ createdAt: -1 })
            .then((result) => resolve(result))
            .catch((err) => reject(err))
    })
}

exports.likePost = async (userId, postId) => {
    return new Promise((resolve, reject) => {
        postModel
            .updateOne(
                { _id: postId },
                {
                    $push: {
                        likes: userId,
                    },
                }
            )
            .then((result) => resolve(result))
            .catch((err) => reject(err))
    })
}

exports.dislikePost = async (userId, postId) => {
    return new Promise((resolve, reject) => {
        postModel
            .updateOne(
                { _id: postId },
                {
                    $pull: {
                        likes: userId,
                    },
                }
            )
            .then((response) => resolve(response))
            .catch((err) => reject(err))
    })
}

exports.findIfPostLiked = async (postId, userId) => {
    return new Promise((resolve, reject) => {
        postModel
            .findOne({ _id: postId, likes: userId })
            .then((response) => resolve(response))
            .catch((err) => reject(err))
    })
}

exports.uploadComment = async (comment, postId, userId) => {
    return new Promise((resolve, reject) => {
        postModel
            .updateOne(
                { _id: postId },
                {
                    $push: {
                        comments: {
                            user: userId,
                            comment: comment,
                            commentedAt: Date.now(),
                        },
                    },
                }
            )
            .then((response) => resolve(response))
            .catch((err) => reject(err))
    })
}

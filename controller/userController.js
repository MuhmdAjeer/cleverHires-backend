const { cloudinary } = require('../utils/cloudinary')
const {
    uploadPost,
    getPosts,
    findById,
    likePost,
    findIfPostLiked,
    dislikePost,
    uploadComment,
} = require('../database/user')
const { ObjectId } = require('mongodb')
const PostModel = require('../model/postModel')
const { isValidObjectId } = require('mongoose')

exports.uploadPost = async (req, res) => {
    const { image, description } = req.body
    try {
        //upload image to cloudinary
        const result = await cloudinary.uploader.upload(image, {
            upload_preset: 'posts',
        })

        let post = {
            user: ObjectId(req.user.id),
            imageUrl: result.url,
        }

        let postId = await PostModel.create(post)

        res.status(201).json({ message: 'Post Uploaded successfully' })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await getPosts()
        console.log(posts)
        res.status(200).json(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}

exports.likePost = async (req, res) => {
    const { postId } = req.body
    try {
        const liked = await findIfPostLiked(postId, req.user.id)
        console.log(liked)

        if (!liked) {
            const result = await likePost(req.user.id, postId)
            return res.status(204).json({ message: 'Post liked successfully' })
        } else {
            const result = await dislikePost(req.user.id, postId)
            return res.status(204).json({ message: 'Post disliked' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.addComment = async (req, res) => {
    const { comment, postId } = req.body

    try {
        const result = await uploadComment(comment, postId, req.user.id)
        res.status(201).json({
            message: 'Comment added successfully',
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

exports.deletePost = async (req, res) => {
    const { id } = req.params
    if (!isValidObjectId(id)) {
        return res.status(400).json({
            status: 'failed',
            message: 'Invalid request',
        })
    }

    try {
        const deletedPost = await PostModel.findOneAndDelete({
            _id: id,
            user: req.user.id,
        })
        if (!deletedPost) {
            return res.status(404).json({
                status: 'failed',
                message: 'Cannot find post',
            })
        }
        return res.status(204).json({ success: true })
    } catch (error) {
        res.status(500).json({
            status: failed,
            message: error.message,
        })
    }
}

const { cloudinary } = require('../utils/cloudinary')
const {uploadPost,getFollowingPosts,findById,likePost,findIfPostLiked,dislikePost,uploadComment,} = require('../database/user')
const { ObjectId } = require('mongodb')
const PostModel = require('../model/postModel')
const { isValidObjectId } = require('mongoose')
const userModel = require('../model/userModel')

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
        const userId = req.user.id
        const posts = await getFollowingPosts(userId)
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

exports.getAllUsers = async (req, res) => {
    try {

        const userId = req.user.id;
        const user = await userModel.findById(userId)
        const requested = user.requested;
        console.log([userId, user]);

        const users = await userModel.find({ _id: { $nin: [userId, requested] } })

        return res.status(200).json(users)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.followUser = async (req, res) => {
    try {
        const followingId = req.params.id;
        const userId = req.user.id;

        if (userId == followingId) {
            return res.status(400).json({
                message: "Cant follow yourself"
            })
        }

        // const ifFollowed = await userModel.findOne({ _id: followingId, following: userId });

        const sender = await userModel.findById(userId);
        const reciever = await userModel.findById(followingId);

        if (
            reciever.followers.includes(sender._id) &&
            sender.following.includes(reciever._id)
        ) {
            return res.status(400).json({
                message: 'Already following'
            })
        }

        const result = await Promise.all([
            userModel.updateOne({ _id: userId }, {
                $addToSet: { following: followingId }
            }),
            userModel.updateOne({ _id: followingId }, {
                $addToSet: { followers: userId }
            })])

        res.status(201).json({
            success: true,
            message: "Followed"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        })
    }
}

exports.unFollowUser = async (req, res) => {
    try {

        const unfollowingId = req.params.id;
        const userId = req.user.id;

        if (userId == unfollowingId) {
            console.log('//');
            return res.status(400).json({
                message: 'Cant unfollow yourself'
            })
        }

        const sender = await userModel.findById(userId);
        const reciever = await userModel.findById(unfollowingId);

        if (
            !reciever.followers.includes(sender._id) &&
            !sender.following.includes(reciever._id)
        ) {
            console.log('not following');
            return res.status(400).json({
                message: "Already not following"
            })
        }

        await Promise.all([
            userModel.updateOne({ _id: userId }, {
                $pull: { following: unfollowingId }
            }),
            userModel.updateOne({ _id: unfollowingId }, {
                $pull: { followers: userId }
            })
        ])

        return res.status(200).json({
            message: 'unfollow success'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


exports.addExperience = async (req, res) => {
    try {
        const userId = req.user.id;
        const { 
            companyName, title, location,
            startMonth, startYear, currentRole,
            endMonth, endYear
        } = req.body;


        if(!companyName || !title || !location || !startMonth || !startYear ){
            return res.status(400).json({
                message : 'Provide full credentials'
            })
        }

        if(currentRole === false && (!endYear || !endMonth)){
            return res.status(400).json({
                message : 'Provide full credentials',
                fields : ['endYear','endMonth']
            })
        }
        const experience = {
            companyName,
            title,
            location,
            startMonth,
            startYear,
            currentRole,
            endMonth,
            endYear
        }

        const {matchedCount , modifiedCount } = await userModel.updateOne({ _id: userId }, {
            $push: {
                experiences: experience 
            }
        })

        if(!matchedCount || !modifiedCount){
            return res.status(400).json({
                message : 'Failed to add experience'
            })
        }

        res.status(201).json({
            message : 'Experience added successfully'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error : error.message
        })
    }
}

exports.getProfile = async(req,res)=>{
    try {
        const userId = req.user.id;
        const username = req.params.username
        console.log({username});
        const user = await userModel.findOne({username : username}).select('-password')

        if(!user){
            return res.status(404).json({
                message : 'No user found!'
            })
        }

        console.log(user);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

exports.updateAbout = async(req,res)=>{
    try {
        const userId = req.user.id;
        const about = req.body.about;
        console.log(req.body);
        if(!about){
            return res.status(400).json({
                message : 'Provide about field'
            })
        }

        const {modifiedCount} =  await userModel.updateOne({_id : userId},{
            $set : { about : about}
        })

        return res.status(200).json({
            message : 'about updated successfully'
        })
    } catch (error) {
        res.status(500).json({
            error : error.message
        })
    }
}

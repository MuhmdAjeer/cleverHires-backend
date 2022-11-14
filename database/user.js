const db = require("../config/connection");
const { USER, POST } = require("./collections");
const bcrypt = require("bcrypt");
const { ObjectId, Timestamp } = require("mongodb");

exports.findByEmail = async (email) => {
  const user = await db.get().collection(USER).findOne({ email: email });
  return user;
};

exports.insertUser = async (user) => {
  try {
    user.password = await bcrypt.hash(user.password, 10);
    user.createdAt = new Date();
    const userDetails = await db.get().collection(USER).insertOne(user);
    return userDetails;
  } catch (error) {
    console.log(error);
  }
};

exports.findById = async (id) => {
  try {
    const user = await db
      .get()
      .collection(USER)
      .findOne({ _id: ObjectId(id) });
    return user;
  } catch (error) {
    console.log(error);
  }
};

exports.uploadPost = async (post) => {
  try {
    const postId = await db.get().collection(POST).insertOne(post);
    return postId;
  } catch (error) {
    console.log(error);
  }
};

exports.getPosts = async () => {
  try {
    const posts = await db
      .get()
      .collection(POST)
      .aggregate([
        {
          $lookup: {
            from: USER,
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
      ])
      .sort({postedAt:-1})
      .toArray()
    return posts;
  } catch (error) {
    console.log(error);
  }
};

exports.likePost = async(userId,postId)=>{
  try {
    const result = await db.get().collection(POST)
    .updateOne({_id : ObjectId(postId) },{
      $push : {
        likes :  ObjectId(userId)
      }
    })
    return result;
  } catch (error) {
    console.log(error);
  }
}

exports.dislikePost = async(userId,postId)=>{
  try {
    const result = await db.get().collection(POST)
    .updateOne({_id : ObjectId(postId)},{
      $pull : {
        likes : ObjectId(userId)
      }
    })
  } catch (error) {
    
  }
}

exports.getPost = async(postId,userId)=>{
  try {
    const post = await db.get().collection(POST)
      .findOne({_id : ObjectId(postId),likes : ObjectId(userId)})
      
    return post
  } catch (error) {
    console.log(error);   
  }
}

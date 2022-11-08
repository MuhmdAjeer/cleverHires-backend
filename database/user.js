const db = require("../config/connection");
const { USER, POST } = require("./collections");
const bcrypt = require("bcrypt");
const { ObjectId, Timestamp } = require("mongodb");

exports.findByEmail = async (email) => {
  const user = await db.get().collection(USER).findOne({ email: email });
  return user;
};

exports.insertUser = async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
  user.createdAt = new Date();
  const userDetails = await db.get().collection(USER).insertOne(user);
  return userDetails;
};

exports.findById = async (id) => {
  const user = await db
    .get()
    .collection(USER)
    .findOne({ _id: ObjectId(id) });
  return user;
};

exports.uploadPost = async (post) => {
  const postId = await db.get().collection(POST).insertOne(post);
  return postId;
};

exports.getPosts = async () => {
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
    .toArray();
  console.log(posts);
  // posts.forEach((post) => console.log());
  return posts;
};

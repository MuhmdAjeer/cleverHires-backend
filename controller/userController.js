const { cloudinary } = require("../utils/cloudinary");
const { uploadPost, getPosts, findById } = require("../database/user");
const { ObjectId } = require("mongodb");

exports.uploadPost = async (req, res) => {
  // console.log(req.body);
  const { image, description } = req.body;
  try {
    console.log(req.user);
    //upload image to cloudinary
    const result = await cloudinary.uploader.upload(image, {
      upload_preset: "posts",
    });

    let post = {
      userId: ObjectId(req.user.id),
      imageUrl: result.url,
      description,
      comments: [],
      likes: [],
      postedAt: new Date(),
    };
    let postId = await uploadPost(post);
    console.log(postId);
    res.status(201).json({ message: "Post Uploaded successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Post upload failed",
    });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await getPosts();
    console.log(posts,'fffdfd');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({error})
  }
};

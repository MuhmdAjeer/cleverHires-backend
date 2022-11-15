const { cloudinary } = require("../utils/cloudinary");
const { uploadPost, getPosts, findById, likePost, getPost, dislikePost, uploadComment } = require("../database/user");
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
    console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error })
  }
};

exports.likePost = async (req, res) => {
    const {postId} = req.body;
    try {

      const liked = await getPost(postId,req.user.id)
      console.log(liked);

      if(!liked){
        const result = await likePost(req.user.id,postId)
        return res.status(204).json({message :"Post liked successfully"})
      }else{
        const result = await dislikePost(req.user.id,postId);
        return res.status(204).json({message:"Post disliked"})
      }
    } catch (error) {
      res.status(500).json({message : error.message})
    }
}

exports.addComment = async (req,res)=>{
  const {comment,postId} = req.body;

  try {
    // add comment to the post
    const result = await uploadComment(comment,postId,req.user.id);
    res.status(201).json({
      message : "Comment added successfully"
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({message : error.message})
  }

}

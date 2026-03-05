const postModel = require("../../models/postModel");
const commentModel = require("../../models/CommentModel");

const min25 = (v) => (v || "").trim().length >= 25;


exports.getAllPosts = (req, res) => {
  postModel
    .find()
    .sort({ createdAt: -1 })
    .populate({
      path: "comments",
      select: "_id body createdAt",
      options: { sort: { createdAt: 1 } } 
    })
    .then((posts) => res.status(200).json({ success: true, posts }))
    .catch((err) => res.status(500).json({ success: false, message: "Server error" }));
};

exports.postOnePost = (req, res) => {
  const postText = (req.body.post || "").trim();

  if (!min25(postText)) {
    return res.status(400).json({
      success: false,
      message: "Post must be at least 25 characters"
    });
  }

  postModel
    .create({ post: postText })
    .then((created) => res.status(201).json({ success: true, post: created }))
    .catch((err) => {
  const msg = err?.errors?.post?.message || "Invalid post";
  return res.status(400).json({ success: false, message: msg });
});
};


exports.updateOnePost = (req, res) => {
  const postText = (req.body.post || "").trim();

  if (!min25(postText)) {
    return res.status(400).json({
      success: false,
      message: "Post must be at least 25 characters"
    });
  }

  postModel
    .findByIdAndUpdate(
      req.params.id,
      { post: postText },
      { new: true, runValidators: true }
    )
    .then((updated) => {
      if (!updated) return res.status(404).json({ success: false, message: "Post not found" });
      res.status(200).json({ success: true, post: updated });
    })
    .catch((err) => {
  const msg = err?.errors?.post?.message || "Invalid post";
  return res.status(400).json({ success: false, message: msg });
});
};


exports.deletePost = (req, res) => {
  const postId = req.params.id;

  postModel
    .findByIdAndDelete(postId)
    .then(async (deleted) => {
      if (!deleted) return res.status(404).json({ success: false, message: "Post not found" });

      await commentModel.deleteMany({ post: postId });

      res.status(200).json({ success: true, message: "Post deleted" });
    })
    .catch(() => res.status(500).json({ success: false, message: "Server error" }));
};


exports.getAllCommentsPost = (req, res) => {
  const postId = req.params.postId;

  commentModel
    .find({ post: postId })
    .sort({ createdAt: 1 })
    .select("_id body createdAt post")
    .then((comments) => res.status(200).json({ success: true, comments }))
    .catch(() => res.status(500).json({ success: false, message: "Server error" }));
};


exports.postOneComment = (req, res) => {
  const postId = req.params.postId;
  const body = (req.body.body || "").trim();

  if (!min25(body)) {
    return res.status(400).json({
      success: false,
      message: "Comment must be at least 25 characters"
    });
  }

  postModel
    .findById(postId)
    .then((post) => {
      if (!post) return res.status(404).json({ success: false, message: "Post not found" });

      return commentModel.create({ body, post: postId });
    })
    .then((createdComment) => {
      if (!createdComment) return;

      return postModel.findByIdAndUpdate(
        postId,
        { $push: { comments: createdComment._id } }
      ).then(() => res.status(201).json({ success: true, comment: createdComment }));
    })
    .catch(() => res.status(400).json({ success: false, message: "Invalid comment" }));
};
const postModel = require('../models/postModel');
const commentModel = require('../models/CommentModel');

const homePage = (req, res) => {
  postModel.find()
    .sort({ createdAt: -1 })
    .populate('comments', "_id body authorName")
    .then(result => { 
     res.render('homePage', { posts: result, error: null, user: req.user || null })
    })
    .catch(err => {
      console.log(err);
      res.render('homePage', { posts: [], error: "Something went wrong", user: req.user || null })
    })
};

const addPost = (req, res) => {
  let newPost = new postModel({
    post: req.body.post,
    authorName: req.user.name,
    authorId: req.user.id
  });

  newPost.save()
    .then(() => res.redirect('/'))
    .catch(err => {
      console.log(err);

      postModel.find().sort({ createdAt: -1 })
        .then(result => {
          const msg = err?.errors?.post?.message || "Invalid post";
          res.render('homePage', { posts: result, error: msg, user: req.user || null });
        })
        .catch(e => {
          console.log(e);
          res.render('homePage', { posts: [], error: "Invalid post", user: req.user || null });
        });
    });
};

const seeMore = (req, res) => {
  postModel.findById(req.params.id)
    .then(result => {
      res.render('seeMore', { post: result, user: req.user || null })
    })
    .catch(err => {
      console.log(err);
      res.redirect('/');
    })
};

const editPost = (req, res) => {
  postModel.findById(req.params.id)
    .then(result => {
      res.render('editPost', { post: result, error: null, user: req.user || null })
    })
    .catch(err => {
      console.log(err);
      res.redirect('/');
    })
};

const deletePost = (req, res) => {
  postModel.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect('/')
    })
    .catch(err => {
      console.log(err);
      res.redirect('/');
    })
};

const updatePost = (req, res) => {
  postModel.findByIdAndUpdate(
    req.params.id,
    { post: req.body.post },
    { runValidators: true } 
  )
    .then(() => {
      res.redirect('/posts/' + req.params.id)
    })
    .catch(err => {
      console.log(err);
      postModel.findById(req.params.id)
        .then(result => {
          const msg = err?.errors?.post?.message || "Invalid post";
          res.render('editPost', { post: result, error: msg })
        })
        .catch(e => {
          console.log(e);
          res.redirect('/');
        })
    })
};

const addComment = (req, res) => {
  const postId = req.params.postId;

  if (!postId || !req.body?.body || req.body.body.trim() === "") {
    return res.redirect("/");
  }

  const commentData = {
    body: req.body.body,
    post: postId,
    authorName: req.user.name,
    authorId: req.user.id,
  };

  const newComment = new commentModel(commentData);

  newComment
    .save()
    .then(() => {
      return postModel.findByIdAndUpdate(
        postId,
        { $push: { comments: newComment._id } },
        { new: true }
      );
    })
    .then(() => res.redirect("/"))
    .catch((err) => {
      console.log("ADD COMMENT ERROR >>>", err);
      return res.redirect("/");
    });
};


const deleteComment = async (req, res) => {
  try {
    const { commentId, postId } = req.params;

    console.log("post id {", postId, "}");
    console.log("comment id {", commentId, "}");


    await postModel.findByIdAndUpdate(
      postId,
      { $pull: { comments: commentId } }
    );

    await commentModel.findByIdAndDelete(commentId);

    return res.redirect("/");
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
};

module.exports = {
  homePage,
  addPost,
  seeMore,
  editPost,
  updatePost,
  deletePost,
  addComment,
  deleteComment
    };
const postModel = require('../models/postModel');
const commentModel = require('../models/CommentModel');

const homePage = (req, res) => {
  postModel.find()
    .sort({ createdAt: -1 })
    .populate('comments', "_id body")
    .then(result => {
      res.render('homepage', { posts: result, error: null })
    })
    .catch(err => {
      console.log(err);
      res.render('homepage', { posts: [], error: "Something went wrong" }) 
    })
};

const addPost = (req, res) => {
  let newPost = new postModel(req.body)
  newPost.save()
    .then(() => {
      res.redirect('/')
    })
    .catch(err => {
      console.log(err);

      postModel.find().sort({ createdAt: -1 })
        .then(result => {
          const msg = err?.errors?.post?.message || "Invalid post";
          res.render('homepage', { posts: result, error: msg })
        })
        .catch(e => {
          console.log(e);
          res.render('homepage', { posts: [], error: "Invalid post" })
        })
    })
};

const seeMore = (req, res) => {
  postModel.findById(req.params.id)
    .then(result => {
      res.render('seeMore', { post: result })
    })
    .catch(err => {
      console.log(err);
      res.redirect('/');
    })
};

const editPost = (req, res) => {
  postModel.findById(req.params.id)
    .then(result => {
      res.render('editPost', { post: result, error: null })
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
  let postId = req.params.postId;

  if (req.body.body !== "" && postId) {
    let commentData = {
      ...req.body,
      post: postId
    }

    let newComment = new commentModel(commentData);
    newComment.save()
      .then(() => {
        postModel.findById(postId)
          .then(postInfo => {
            postInfo.comments.push(newComment._id);
            postInfo.save()
              .then(() => {
                res.redirect("/")
              })
              .catch(err => {
                console.log(err);
                res.redirect('/');
              })
          })
          .catch(err => {
            console.log(err);
            res.redirect('/');
          })
      })
      .catch(err => {
        console.log(err);
        res.redirect('/');
      })
  } else {
    res.redirect('/');
  }
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

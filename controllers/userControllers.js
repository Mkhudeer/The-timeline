const postModel = require('../models/postModel');

const homePage = (req, res) => {
    postModel.find().sort({ createdAt: -1 })
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
            console.log("A new post has been added")
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

module.exports = {
    homePage,
    addPost,
    seeMore,
    editPost,
    updatePost,
    deletePost
};

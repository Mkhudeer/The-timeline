const express = require('express');
const route = express.Router();
const userController = require('../controllers/userControllers');
const { requireAuth } = require("../middleware/auth");

route.get('/', userController.homePage);
route.get('/posts/:id', userController.seeMore);

route.post('/add-post', requireAuth, userController.addPost);
route.get('/edit/:id', requireAuth, userController.editPost);
route.post('/edit/:id', requireAuth, userController.updatePost);
route.get('/delete/post/:id', requireAuth, userController.deletePost);


route.post('/post/add/new-comment/:postId', requireAuth, userController.addComment);
route.get('/delete/comment/:commentId/:postId', requireAuth, userController.deleteComment);

module.exports = route;
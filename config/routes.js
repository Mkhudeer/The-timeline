const express = require('express');
const route = express.Router();
const userController = require('../controllers/userControllers');

route.get('/', userController.homePage);
route.post('/add-post', userController.addPost);
route.get('/posts/:id', userController.seeMore);
route.get('/edit/:id', userController.editPost);
route.post('/edit/:id', userController.updatePost);
route.get('/delete/post/:id', userController.deletePost);


module.exports = route;
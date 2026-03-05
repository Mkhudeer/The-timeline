const express = require("express");
const router = express.Router();
const controller = require("../controllers/api/apiController");


router.get("/api/get-posts", controller.getAllPosts);
router.post("/api/create-post", controller.postOnePost);
router.put("/api/edit-post/:id", controller.updateOnePost);
router.delete("/api/delete-post/:id", controller.deletePost);


router.get("/api/get-post-comments/:postId", controller.getAllCommentsPost);
router.post("/api/post-post-comment/:postId", controller.postOneComment);

module.exports = router;
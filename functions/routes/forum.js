const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  createPost,
  editPost,
  deletePost,
} = require("../API/forum");

router.get("/", getAllPosts);
router.post("/", createPost);
router.put("/:postID", editPost);
router.delete("/:postID", deletePost);

module.exports = router;

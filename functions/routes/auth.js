const express = require("express");
const router = express.Router();
const userRouter = express.Router();
const {
  loginUser,
  createUser,
  uploadProfilePhoto,
  getUserDetail,
} = require("../API/auth");
const auth = require("../util/auth");

userRouter.get("/", getUserDetail);
userRouter.post("/", updateUserDetails);
userRouter.post("/image", uploadProfilePhoto);

router.post("/login", loginUser);
router.post("/signup", createUser);
router.use("/user", auth, userRouter);

module.exports = router;

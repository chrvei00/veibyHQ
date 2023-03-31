const functions = require("firebase-functions");
const app = require("express")();

//Routees
const forumRouter = require("./routes/forum");
const authRouter = require("./routes/auth");

app.use("/auth", authRouter);
app.use("/forum", auth, forumRouter);
exports.api = functions.https.onRequest(app);

const { db } = require("../util/admin");

exports.getAllPosts = (request, response) => {
  db.collection("posts")
    .get()
    .then((data) => {
      let posts = [];
      data.forEach((doc) => {
        posts.push({
          postID: doc.id,
          title: doc.data().title,
          body: doc.data().body,
          authorUsername: doc.data().authorUsername,
        });
      });
      return response.json(posts);
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

exports.createPost = (request, response) => {
  const newPost = {
    title: request.body.title,
    body: request.body.body,
    authorUsername: request.user.username,
    createdAt: new Date().toISOString(),
  };

  db.collection("posts")
    .add(newPost)
    .then((doc) => {
      const responsePost = newPost;
      responsePost.postID = doc.id;
      return response.json(responsePost);
    })
    .catch((err) => {
      response.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
};

exports.editPost = (request, response) => {
  if (request.body.postID || request.body.createdAt) {
    response.status(403).json({ message: "Not allowed to edit" });
  } else if (request.body.body.trim() === "") {
    return response.status(400).json({ body: "Must not be empty" });
  } else if (request.body.title.trim() === "") {
    return response.status(400).json({ title: "Must not be empty" });
  }
  let document = db.collection("posts").doc(`${request.params.postID}`);
  if (request.user.username !== request.body.authorUsername) {
    return response.status(403).json({ error: "Unauthorized" });
  } else if (document.authorUsername !== request.user.username) {
    return response.status(403).json({ error: "Unauthorized" });
  }
  document
    .update(request.body)
    .then(() => {
      response.json({ message: "Document updated successfully" });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({
        error: err.code,
      });
    });
};

exports.deletePost = (request, response) => {
  const document = db.doc(`/posts/${request.params.postID}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json({ error: "Post not found" });
      } else if (doc.data().authorUsername !== request.user.username) {
        return response.status(403).json({ error: "Unauthorized" });
      }
      return document.delete();
    })
    .then(() => {
      response.json({ message: "Post deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

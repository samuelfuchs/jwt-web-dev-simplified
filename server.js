require("dotenv").config();

const { application } = require("express");
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
const posts = [
  { username: "Kyle", title: "Post 1" },
  { username: "Jim", title: "Post 2" },
];

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  // IF we have an 'authHeader', get the 2nd argument
  // otherwise (&&) just return undefined
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // 403 - You have a token, but no longer access
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(3000);

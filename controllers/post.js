import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const addPost = (req, res) => {};

export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not Authenticated");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE `id`=? AND `user_id`=?";

    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err || data.affectedRows === 0)
        return res
          .status(403)
          .json("You don't have access to delete this post");

      return res.json("Post has been deleted successfully");
    });
  });
};

export const updatePost = (req, res) => {};

export const getAllPost = (req, res) => {
  const q = req.query.cat
    ? "SELECT * FROM posts WHERE cat=?"
    : "SELECT * FROM posts";
  db.query(q, [req.query.cat], (err, data) => {
    if (err) return res.send(err);

    return res.status(200).json(data);
  });
};

export const getPostById = (req, res) => {
  const q =
    "SELECT u.`id` ownerId, `username` owner, u.`img` ownerImg, `title`, `desc`, p.`img` postImg, `date`, p.`cat` FROM posts p JOIN users u ON u.id=p.user_id where p.id=?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) res.send(err);
    return res.status(200).json(data[0]);
  });
};

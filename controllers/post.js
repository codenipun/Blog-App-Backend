import { db } from "../db.js";

export const addPost = (req, res) => {};

export const deletePost = (req, res) => {};

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

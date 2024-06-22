import { db } from "../db.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

export const addPost = (req, res) => {
  (async function () {
    // Configuration
    cloudinary.config({
      cloud_name: "codenipun",
      api_key: "343214482815982",
      api_secret: "BuP8EdUjqoSa4kAyCS43iweFbgo",
    });

    // Upload an image
    const uploadResult = await cloudinary.uploader
      .upload(`./uploads/${req.body.img}`, {
        public_id: "blog-img",
      })
      .catch((error) => {
        console.log(error);
      });

    // const token = req?.cookies?.access_token;
    // // console.log(token);
    // if (!token) return res.status(401).json("Not Authenticated");

    // jwt.verify(token, "jwtkey", (err, userInfo) => {
    //   if (err) return res.status(403).json("Token is not valid");
      const q =
        "INSERT INTO posts(`title`, `desc`, `img`, `date`, `user_id`, `cat`) VALUES (?)";

      const values = [
        req.body.title,
        req.body.desc,
        uploadResult.secure_url,
        req.body.date,
        req.body.user_id,
        req.body.cat,
      ];

      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);

        return res.status(200).json("Post Created Successfully!");
      });
    // });
  })();
};

export const deletePost = (req, res) => {
  // const token = req.cookies.access_token;
  // console.log(req)
  // console.log(token);
  // if (!token) return res.status(401).json("Not Authenticated");

  // jwt.verify(token, "jwtkey", (err, userInfo) => {
  //   if (err) return res.status(403).json("Token is not valid");

    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE `id`=?";

    db.query(q, [postId], (err, data) => {
      if (err || data.affectedRows === 0)
        return res
          .status(403)
          .json("You don't have access to delete this post");

      return res.json("Post has been deleted successfully");
    });
  // });
};

export const updatePost = (req, res) => {
  // const token = req.cookies.access_token;
  // if (!token) return res.status(401).json("Not Authenticated");

  // jwt.verify(token, "jwtkey", (err, userInfo) => {
  //   if (err) return res.status(403).json("Token is not valid");

    (async function () {
      // Configuration
      cloudinary.config({
        cloud_name: "codenipun",
        api_key: "343214482815982",
        api_secret: "BuP8EdUjqoSa4kAyCS43iweFbgo",
      });
      let q;
      let values = [];
      if (req.body.img != null) {
        const uploadResult = await cloudinary.uploader
          .upload(`./uploads/${req.body.img}`, {
            public_id: "blog-img",
          })
          .catch((error) => {
            console.log(error);
          });

        q =
          "UPDATE posts SET `title`=?, `desc`=?, `img`=?, `cat`=? WHERE `id`=? AND `user_id`=?";
        values = [
          req.body.title,
          req.body.desc,
          uploadResult.secure_url,
          req.body.cat,
        ];
      } else {
        q =
          "UPDATE posts SET `title`=?, `desc`=?, `cat`=? WHERE `id`=? AND `user_id`=?";
        values = [req.body.title, req.body.desc, req.body.cat];
      }

      const postId = req.params.id;

      db.query(q, [...values, postId, req.body.user_id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post Updated Successfully!");
      });
    })();
  // });
};

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
    "SELECT u.`id` ownerId, `username` owner, u.`img` ownerImg, p.`id` postId, `title`, `desc`, p.`img` postImg, `date`, p.`cat` FROM posts p JOIN users u ON u.id=p.user_id where p.id=?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) res.send(err);
    return res.status(200).json(data[0]);
  });
};

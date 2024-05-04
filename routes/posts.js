import express from 'express'
import { addPost, deletePost, getAllPost, getPostById, updatePost } from '../controllers/post.js'

const router = express.Router()

// To get all the post
router.get("/", getAllPost)

// To get a specific post
router.get("/:id", getPostById)

// To create a New Post
router.post("/", addPost)

// To delete a specific post
router.delete("/:id", deletePost)

// To update a specific post
router.post("/:id", updatePost)

export default router
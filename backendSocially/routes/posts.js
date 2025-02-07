const express = require('express')
const router = express.Router()
const postController = require('../controllers/posts')
const upload = require('../middlewares/uploadPosts')

router.post('/upload',upload.array('images',10),postController.uploadPostPhotos)

router.post('/uploadPost/:userId',upload.array('images',10),postController.uploadPost)
router.get('/myPosts/:userId',postController.showMyPosts)
router.get('/',postController.showAllPosts)
router.delete('/delete/:postId',postController.deletePost)
router.get('/showOnePost/:postId',postController.showOnePost)
router.get('/filtered/:username',postController.filteredPosts)
router.get('/myPostLikes/:postId',postController.myPostLikers)

router.patch('/like/:postId',postController.likedAPost)
router.patch('/unlike/:postId',postController.unLikeAPost)

module.exports =  router


/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API for managing posts
 */

/**
 * @swagger
 * /posts/upload:
 *   post:
 *     tags: [Posts]
 *     summary: Upload multiple images for a post
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *       400:
 *         description: Invalid input or upload error
 */

/**
 * @swagger
 * /posts/uploadPost/{userId}:
 *   post:
 *     tags: [Posts]
 *     summary: Upload a new post with multiple images
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user uploading the post
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Post uploaded successfully
 *       400:
 *         description: Invalid input or upload error
 */

/**
 * @swagger
 * /posts/myPosts/{userId}:
 *   get:
 *     tags: [Posts]
 *     summary: Retrieve all posts by a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of user posts
 *       404:
 *         description: User not found or no posts available
 */

/**
 * @swagger
 * /posts/:
 *   get:
 *     tags: [Posts]
 *     summary: Retrieve all posts
 *     responses:
 *       200:
 *         description: List of all posts
 *       404:
 *         description: No posts available
 */

/**
 * @swagger
 * /posts/delete/{postId}:
 *   delete:
 *     tags: [Posts]
 *     summary: Delete a post by its ID
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /posts/showOnePost/{postId}:
 *   get:
 *     tags: [Posts]
 *     summary: Retrieve a specific post by its ID
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: Post details
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /posts/filtered/{username}:
 *   get:
 *     tags: [Posts]
 *     summary: Retrieve posts filtered by username
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username to filter posts by
 *     responses:
 *       200:
 *         description: List of posts by the specified username
 *       404:
 *         description: No posts found for the username
 */

/**
 * @swagger
 * /posts/myPostLikes/{postId}:
 *   get:
 *     tags: [Posts]
 *     summary: Retrieve the list of users who liked a post
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: List of users who liked the post
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /posts/like/{postId}:
 *   patch:
 *     tags: [Posts]
 *     summary: Like a post
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to like
 *     responses:
 *       200:
 *         description: Post liked successfully
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /posts/unlike/{postId}:
 *   patch:
 *     tags: [Posts]
 *     summary: Unlike a post
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to unlike
 *     responses:
 *       200:
 *         description: Post unliked successfully
 *       404:
 *         description: Post not found
 */

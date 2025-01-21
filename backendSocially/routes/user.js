const express = require('express')
const router = express.Router()
const {registerUser,updateUser,getAllUsers, uploadImage,updateProfilePic,getUsersForSearching,loginUser,getOneUser,getUsersExceptMe,seeAnotherUser,privateAccount,deleteAccount} = require('../controllers/user')
const upload = require('../middlewares/uploadImage')
const {getUser} = require('../services/authLogin')

router.post('/uploadPhoto',upload.single('profilePhoto'),uploadImage)

router.get('/',getAllUsers)

router.get('/search',getUsersForSearching)

router.post('/register',upload.single('profilePhoto'),registerUser)
router.patch('/updatePic/:userId',upload.single('profilePhoto'),updateProfilePic)
router.patch('/update/:userId',updateUser)
router.post('/login',loginUser)

router.get('/:id',getUser,getOneUser)
router.get('/notme/:id',getUser,getUsersExceptMe)
router.get('/other/user',seeAnotherUser)

router.patch('/privacy/:userId',getUser,privateAccount)
router.delete('/delete/:userId',getUser,deleteAccount)



module.exports = router

/**
 * @swagger
 * /uploadPhoto:
 *   post:
 *     summary: Upload a profile photo.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: profilePhoto
 *         type: file
 *         required: true
 *         description: Profile photo to upload.
 *     responses:
 *       200:
 *         description: Photo uploaded successfully.
 */


/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all users.
 *     responses:
 *       200:
 *         description: A list of users.
 */


/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search for users.
 *     responses:
 *       200:
 *         description: A list of matching users.
 */


/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: profilePhoto
 *         type: file
 *         required: true
 *         description: Profile photo for the user.
 *     responses:
 *       201:
 *         description: User registered successfully.
 */


/**
 * @swagger
 * /updatePic/{userId}:
 *   patch:
 *     summary: Update a user's profile picture.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user.
 *         schema:
 *           type: string
 *       - in: formData
 *         name: profilePhoto
 *         type: file
 *         required: true
 *         description: New profile photo.
 *     responses:
 *       200:
 *         description: Profile picture updated successfully.
 */


/**
 * @swagger
 * /update/{userId}:
 *   patch:
 *     summary: Update user details.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details updated successfully.
 */


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user.
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User login credentials.
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Login successful.
 */


/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get a user by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details.
 */


/**
 * @swagger
 * /notme/{id}:
 *   get:
 *     summary: Get users except the specified user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to exclude.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of other users.
 */


/**
 * @swagger
 * /other/user:
 *   get:
 *     summary: See another user.
 *     responses:
 *       200:
 *         description: User details.
 */


/**
 * @swagger
 * /privacy/{userId}:
 *   patch:
 *     summary: Make a user account private.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account privacy updated.
 */


/**
 * @swagger
 * /delete/{userId}:
 *   delete:
 *     summary: Delete a user account.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account deleted successfully.
 */

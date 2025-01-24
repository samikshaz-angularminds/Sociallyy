const express = require('express')
const router = express.Router()
const { registerUser, updateUser, getAllUsers, uploadImage, updateProfilePic, getUsersForSearching, loginUser, getOneUser, getUsersExceptMe, seeAnotherUser, privateAccount, deleteAccount } = require('../controllers/user')
const upload = require('../middlewares/uploadImage')
const { getUser } = require('../services/authLogin')

router.post('/uploadPhoto', upload.single('profilePhoto'), uploadImage)

router.get('/', getAllUsers)

router.get('/search', getUsersForSearching)

router.post('/register', upload.single('profilePhoto'), registerUser)
router.patch('/updatePic/:userId', upload.single('profilePhoto'), updateProfilePic)
router.patch('/update/:userId', updateUser)
router.post('/login', loginUser)

router.get('/:id', getUser, getOneUser)
router.get('/notme/:id', getUser, getUsersExceptMe)
router.get('/other/user', seeAnotherUser)

router.patch('/privacy/:userId', getUser, privateAccount)
router.delete('/delete/:userId', getUser, deleteAccount)



module.exports = router
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User routes
 */

/**
 * @swagger
 * /user/uploadPhoto:
 *   post:
 *     tags:
 *       - User
 *     summary: Upload a profile photo.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *              -profilePhoto
 *             properties:
 *               profilePhoto:
 *                 type: string
 *                 format: binary
 *                 description: Profile photo to upload.
 *     responses:
 *       200:
 *         description: Photo uploaded successfully.
 */

/**
 * @swagger
 * /user/:
 *   get:
 *     tags :
 *       - User
 *     summary: Get all users.
 *     responses:
 *       200:
 *         description: A list of users.
 */


/**
 * @swagger
 * /user/search:
 *   get:
 *     tags :
 *       - User
 *     summary: Search for users.
 *     responses:
 *       200:
 *         description: A list of matching users.
 */


/**
 * @swagger
 * /user/register:
 *   post:
 *     tags :
 *       - User
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
 * /user/updatePic/{userId}:
 *   patch:
 *     tags :
 *       - User
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
 * /user/update/{userId}:
 *   patch:
 *     tags :
 *       - User
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
 * /user/login:
 *   post:
 *     tags :
 *       - User
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
 * /user/{id}:
 *   get:
 *     tags :
 *       - User
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
 * /user/notme/{id}:
 *   get:
 *     tags :
 *       - User
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
 * /user/other/user:
 *   get:
 *     tags :
 *       - User
 *     summary: See another user.
 *     parameters:
 *       - in: query
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose profile is being viewed
 *       - in: query
 *         name: viewerUid
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user who is viewing the profile
 *     responses:
 *       200:
 *         description: User details.
 */


/**
 * @swagger
 * /user/privacy/{userId}:
 *   patch:
 *     tags :
 *       - User
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
 * /user/delete/{userId}:
 *   delete:
 *     tags :
 *       - User
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
 *       400:
 *         description: Invalid user ID provided.
 *       401:
 *         description: Unauthorized. Please provide valid authentication credentials.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error. Please try again later.
 */

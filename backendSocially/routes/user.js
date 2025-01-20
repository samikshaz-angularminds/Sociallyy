const express = require('express')
const router = express.Router()
const {registerUser,updateUser,getAllUsers, uploadImage,updateProfilePic,getUsersForSearching,loginUser,getOneUser,getUsersExceptMe,seeAnotherUser,privateAccount,deleteAccount} = require('../controllers/user')
const upload = require('../middlewares/uploadImage')
const {getUser} = require('../services/authLogin')

// router.post('/uploadPhoto',upload.single('profilePhoto'),uploadImage)

// router.get('/',getAllUsers)

// router.get('/search',getUsersForSearching)

// router.post('/register',upload.single('profilePhoto'),registerUser)
// router.patch('/updatePic/:userId',upload.single('profilePhoto'),updateProfilePic)
// router.patch('/update/:userId',updateUser)
// router.post('/login',loginUser)

// router.get('/:id',getUser,getOneUser)
// router.get('/notme/:id',getUser,getUsersExceptMe)
// router.get('/other/user',seeAnotherUser)

// router.patch('/privacy/:userId',getUser,privateAccount)
// router.delete('/delete/:userId',getUser,deleteAccount)




/**
 * @swagger
 * tags:
 *   name: User
 *   description: Operations related to user
 */

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - User
 *     summary: "Get all users"
 *     description: "Returns a list of all users"
 *     responses:
 *       200:
 *         description: "List of users"
 */
router.get('/', getAllUsers);

/**
 * @swagger
 * /search:
 *   get:
 *     tags:
 *       - User
 *     summary: "Search for users"
 *     description: "Search for users by username or other criteria"
 *     responses:
 *       200:
 *         description: "Search results"
 */
router.get('/search', getUsersForSearching);

/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - User
 *     summary: "Register a new user"
 *     description: "Registers a new user with details"
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               example: "any"
 *             email:
 *               example: "any"
 *             password:
 *               example: "any"
 *             full_name:
 *               example: "any"
 *             bio:
 *               example: "any"
 *             phone:
 *               example: "any"
 *             website:
 *               example: "any"
 *     responses:
 *       200:
 *         description: "User successfully registered"
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /updatePic/{userId}:
 *   patch:
 *     tags:
 *       - User
 *     summary: "Update user profile picture"
 *     description: "Update the profile picture of the specified user"
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: "Profile picture updated"
 */
router.patch('/updatePic/:userId', updateProfilePic);

/**
 * @swagger
 * /update/{userId}:
 *   patch:
 *     tags:
 *       - User
 *     summary: "Update user details"
 *     description: "Update the details of the specified user"
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               example: "any"
 *             email:
 *               example: "any"
 *             password:
 *               example: "any"
 *             full_name:
 *               example: "any"
 *             bio:
 *               example: "any"
 *             phone:
 *               example: "any"
 *             website:
 *               example: "any"
 *     responses:
 *       200:
 *         description: "User details updated"
 */
router.patch('/update/:userId', updateUser);


module.exports = router

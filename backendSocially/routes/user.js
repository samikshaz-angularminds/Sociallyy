const express = require('express')
const router = express.Router()
const {registerUser,getAllUsers, uploadImage,getUsersForSearching,loginUser,getOneUser,getUsersExceptMe,seeAnotherUser,privateAccount,deleteAccount} = require('../controllers/user')
const upload = require('../middlewares/uploadImage')
const {getUser} = require('../services/authLogin')

// router.post('/uploadPhoto',upload.single('profilePhoto'),uploadImage)
router.get('/',getAllUsers)
router.get('/search',getUsersForSearching)

router.post('/register',upload.single('profilePhoto'),registerUser)
router.post('/login',loginUser)

router.get('/:id',getUser,getOneUser)
router.get('/notme/:id',getUser,getUsersExceptMe)
router.get('/other/user',seeAnotherUser)

router.patch('/privacy/:userId',getUser,privateAccount)
router.delete('/delete/:userId',getUser,deleteAccount)



module.exports = router
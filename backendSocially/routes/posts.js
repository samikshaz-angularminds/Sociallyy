const express = require('express')
const router = express.Router()
const {uploadPostPhotos,uploadPost,showMyPosts,showOnePost,showAllPosts,deletePost,likedAPost,unLikeAPost} = require('../controllers/posts')
const upload = require('../middlewares/uploadPosts')

router.post('/upload',upload.array('images',10),uploadPostPhotos)

router.post('/uploadPost/:userId',upload.array('images',10),uploadPost)
router.get('/myPosts/:userId',showMyPosts)
router.get('/',showAllPosts)
router.delete('/delete/:postId',deletePost)
router.get('/showOnePost/:postId',showOnePost)

router.patch('/like/:postId',likedAPost)
router.patch('/unlike/:postId',unLikeAPost)


module.exports =  router
const { showAllRequests,sendRequest,showMyRequests,acceptRequest, showMyFollowers, showMyFollowing,deleteRequest,removeRejectedRequests,removeFromFollowers,removeFromFollowings } = require('../controllers/folllowRequests')
const express = require('express')
const router = express.Router()

router.get('/showAll',showAllRequests)
router.post('/send/:name',sendRequest)
router.get('/received/:name',showMyRequests)
router.patch('/accept/:name',acceptRequest)
router.get('/followers/:name',showMyFollowers)
router.get('/followings/:name',showMyFollowing)

router.delete('/delete/:name',deleteRequest)
router.delete('/removeFollower/:name',removeFromFollowers)
router.delete('/removeFollowing/:name',removeFromFollowings)
router.delete('/removeRejected',removeRejectedRequests)



module.exports = router
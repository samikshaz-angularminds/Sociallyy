const { showAllRequests,requestSuggestions ,sendRequest,showMyRequests,acceptRequest, pendingRequests,showMyFollowers, showMyFollowing,deleteRequest,removeRejectedRequests,removeFromFollowers,removeFromFollowings } = require('../controllers/folllowRequests')
const express = require('express')
const router = express.Router()

router.get('/showAll',showAllRequests)
router.get('/suggestions/:myUid',requestSuggestions)
router.post('/send/:senderUid',sendRequest)
router.get('/received/:myUid',showMyRequests)
router.patch('/accept/:acceptorUid',acceptRequest)
router.get('/followers/:myUid',showMyFollowers)
router.get('/followings/:myUid',showMyFollowing)
router.get('/pending/:myUid', pendingRequests)

router.delete('/delete/:myUid',deleteRequest)
router.delete('/removeFollower/:myUid',removeFromFollowers)
router.delete('/removeFollowing/:myUid',removeFromFollowings)
router.delete('/removeRejected',removeRejectedRequests)



module.exports = router
/**
 * @swagger
 * tags:
 *   name: Request
 *   description: API for managing Requests
 */


/**
 * @swagger
 * /requests/showAll:
 *   get:
 *     summary: Show all requests
 *     tags: [Request]
 *     responses:
 *       200:
 *         description: Successfully fetched all requests.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 *       404:
 *         description: Not found.
 */

/**
 * @swagger
 * /requests/suggestions/{myUid}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get suggested users for a specific user.
 *     parameters:
 *       - in: path
 *         name: myUid
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user requesting suggestions
 *     responses:
 *       200:
 *         description: A list of suggested users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Unique ID of the suggested user
 *                   username:
 *                     type: string
 *                     description: Username of the suggested user
 *                   full_name:
 *                     type: string
 *                     description: Full name of the suggested user
 *                   profileImage:
 *                     type: string
 *                     description: URL of the suggested user's profile image
 *                   mutualFollowersCount:
 *                     type: integer
 *                     description: Number of mutual followers
 *       400:
 *         description: Bad request (e.g., missing or invalid `myUid` parameter)
 *       404:
 *         description: No suggestions found for the user
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /requests/send/{senderUid}:
 *   post:
 *     summary: Send a request to a user
 *     tags: [Request]
 *     parameters:
 *       - in: path
 *         name: senderUid
 *         required: true
 *         description: The UID of the sender (the user sending the request).
 *     requestBody:
 *       required: true
 *       description: The request body containing the receiver's UID.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiverUid:
 *                 type: string
 *                 description: The UID of the receiver (the user receiving the request).
 *     responses:
 *       200:
 *         description: Request sent successfully.
 *       400:
 *         description: Invalid sender/receiver or request format.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 *         
 */


/**
 * @swagger
 * /requests/received/{myUid}:
 *   get:
 *     summary: Show my received requests by name
 *     tags: [Request]
 *     parameters:
 *       - in: path
 *         name: myUid
 *         required: true
 *         description: The name of the user.
 *     responses:
 *       200:
 *         description: Successfully fetched received requests.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 *       404:
 *         description: Not found.
 */

/**
 * @swagger
 * /requests/accept/{acceptorUid}:
 *   patch:
 *     summary: Accept a follow request and update both users' relationships
 *     description: This endpoint allows the acceptor user to accept a follow request from the requestor. It updates the follow status and modifies the followers and followings list of both users.
 *     tags: [Request]
 *     parameters:
 *       - in: path
 *         name: acceptorUid
 *         required: true
 *         description: The unique identifier (UID) of the user who is accepting the follow request.
 *         schema:
 *           type: string
 *           
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestorUid:
 *                 type: string
 *                 example: "string"
 *                 description: The UID of the user who sent the follow request.
 *                 
 *     responses:
 *       200:
 *         description: The follow request was successfully accepted and the user relationship was updated.
 *       400:
 *         description: Invalid UID format or missing data in the request body.
 *       404:
 *         description: The follow request or user was not found.
 *       500:
 *         description: Internal server error while processing the request.
 */


/**
 * @swagger
 * /requests/followers/{myUid}:
 *   get:
 *     summary: Show followers by name
 *     tags: [Request]
 *     parameters:
 *       - in: path
 *         name: myUid
 *         required: true
 *         description: The name of the user.
 *     responses:
 *       200:
 *         description: Successfully fetched followers.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 *       404:
 *         description: Not found.
 */

/**
 * @swagger
 * /requests/followings/{myUid}:
 *   get:
 *     summary: Show followings by name
 *     tags: [Request]
 *     parameters:
 *       - in: path
 *         name: myUid
 *         required: true
 *         description: The myUid of the user.
 *     responses:
 *       200:
 *         description: Successfully fetched followings.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 *       404:
 *         description: Not found.
 */

/**
 * @swagger
 * /requests/pending/{myUid}:
 *   get:
 *     summary: Show pending requests by name
 *     tags: [Request]
 *     parameters:
 *       - in: path
 *         name: myUid
 *         required: true
 *         description: The myUid of the user.
 *     responses:
 *       200:
 *         description: Successfully fetched pending requests.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 *       404:
 *         description: Not found.
 */

/**
 * @swagger
 * /requests/delete/{myUid}:
 *   delete:
 *     summary: Delete a request by name
 *     tags: [Request]
 *     parameters:
 *       - in: path
 *         name: myUid
 *         required: true
 *         description: The myUid of the request to delete.
 *     responses:
 *       200:
 *         description: Request deleted successfully.
 *       400:
 *         description: Invalid name or request format.
 *       500:
 *         description: Internal server error.
 *       404:
 *         description: Not found.
 */

/**
 * @swagger
 * /requests/removeFollower/{myUid}:
 *   delete:
 *     summary: Remove a follower by name
 *     tags: [Request]
 *     parameters:
 *       - in: path
 *         name: myUid
 *         required: true
 *         description: The myUid of the follower to remove.
 *     responses:
 *       200:
 *         description: Follower removed successfully.
 *       400:
 *         description: Invalid name or request format.
 *       500:
 *         description: Internal server error.
 *       404:
 *         description: Not found.
 */

/**
 * @swagger
 * /requests/removeFollowing/{myUid}:
 *   delete:
 *     summary: Remove a following by name
 *     tags: [Request]
 *     parameters:
 *       - in: path
 *         name: myUid
 *         required: true
 *         description: The myUid of the following to remove.
 *     responses:
 *       200:
 *         description: Following removed successfully.
 *       400:
 *         description: Invalid name or request format.
 *       500:
 *         description: Internal server error.
 *       404:
 *         description: Not found.
 */

/**
 * @swagger
 * /requests/removeRejected:
 *   delete:
 *     summary: Remove rejected requests
 *     tags: [Request]
 *     responses:
 *       200:
 *         description: Rejected requests removed successfully.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 *       404:
 *         description: Not found.
 */

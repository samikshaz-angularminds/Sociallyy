const express = require('express')
const router = express.Router()

const {sendMessage,getAllMessages,myMessages,getConversation} = require('../controllers/message')

router.get('/',getAllMessages)
router.get('/myMessages/:myUid',myMessages)
router.get('/conv/:viewerUid',getConversation)

router.post('/send/:senderUid',sendMessage)

module.exports = router


/**
 * @swagger
 * tags:
 *   - name: Messages
 *     description: Operations related to messages
 */

/**
 * @swagger
 * /message/:
 *   get:
 *     summary: Get all messages
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: A list of all messages
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /message/myMessages/{myUid}:
 *   get:
 *     summary: Get messages for a specific user
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: myUid
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the person whose messages are to be fetched
 *     responses:
 *       200:
 *         description: A list of messages for the specified user
 *       400:
 *         description: Bad request (e.g., invalid username)
 *       404:
 *         description: No messages found for the specified user
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /message/conv/{viewerUid}:
 *   get:
 *     summary: Get conversation between two users
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: viewerUid
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the viewer to fetch the conversation
 *     responses:
 *       200:
 *         description: A conversation between two users
 *       400:
 *         description: Bad request (e.g., invalid username)
 *       404:
 *         description: Conversation not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /message/send/{senderUid}:
 *   post:
 *     summary: Send a message
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: senderUid
 *         required: true
 *         schema:
 *           type: string
 *         description: The sender's username
 *       - in: body
 *         name: message
 *         description: The message content to be sent
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             recipient:
 *               type: string
 *               description: The recipient's username
 *             message:
 *               type: string
 *               description: The content of the message
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Bad request (e.g., missing parameters)
 *       500:
 *         description: Internal server error
 */

const express = require('express')
const router = express.Router()

const {sendMessage,getAllMessages,myMessages,getConversation} = require('../controllers/message')

router.get('/',getAllMessages)
router.get('/myMessages/:myname',myMessages)
router.get('/conv/:viewer',getConversation)

router.post('/send/:sender',sendMessage)

module.exports = router
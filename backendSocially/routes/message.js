const express = require('express')
const router = express.Router()

const {sendMessage} = require('../controllers/message')

router.post('/send/:sender',sendMessage)

module.exports = router
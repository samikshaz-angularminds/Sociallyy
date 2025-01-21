const { Thread } = require('../models/message')

async function sendMessage(req, res) {
    const sender = req.params.sender
    const { receiver, message, messageType } = req.body

    // console.log('SENDER: ', sender);
    // console.log('RECEIVER: ', req.body);

    let conversation;

    // console.log(receiver.length);

    // console.log( typeof receiver );

    if (typeof receiver === Array) {
        conversation = await Thread.findOne({ participants: { $all: [sender, ...receiver] } })
    }
    else {
        conversation = await Thread.findOne({ participants: { $all: [sender, receiver] } })
    }


    if (!conversation) {
        if (typeof receiver === Array) {
            conversation = await Thread.create({
                participants: [sender, ...receiver],
                message: []
            })
        }
        else {
            conversation = await Thread.create({
                participants: [sender, receiver],
                message: []
            })
        }
    }

    conversation.message.push({
        sender,
        message,
        messageType,
        receiver
    })

    conversation.lastUpdated = Date.now()

    await conversation.save()

    return res.json(conversation)

}

async function getAllMessages(req, res) {
    const allMessages = await Thread.find({})

    return res.json(allMessages)
}

async function myMessages(req, res) {
    const me = req.params.myname

    const myMessages = await Thread.find({
        participants: me
    })

    return res.json(myMessages)
}

async function getConversation(req, res) {
    const viewer = req.params.viewer

    const other = req.query.otherUser

    let conv = await Thread.find({ participants: { $all: [viewer, other] } })
    conv.receiver = await other

    // console.log(conv)
    return res.json(conv)
}

async function editMessage(req, res) {

}


module.exports = { sendMessage, getAllMessages, myMessages, getConversation }

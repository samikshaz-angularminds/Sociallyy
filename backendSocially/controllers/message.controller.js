const Thread  = require('../models/message.model')

async function sendMessage(req, res) {
    const sender = req.params.senderUid
    const { receiver, message, messageType } = req.body

    console.log('SENDER: ', sender);
    console.log('RECEIVER: ', req.body);

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

    // io.emit('new-message',message)

    conversation.lastUpdated = Date.now()

    await conversation.save()

    return res.json(conversation)

}

async function getAllMessages(req, res) {
    const allMessages = await Thread.find({})

    return res.json(allMessages)
}

async function myMessages(req, res) {
    const me = req.params.myUid
    
    const myMessages = await Thread.find({
        participants: me
    })    

    return res.json(myMessages)
}

async function getConversation(req, res) {
    const viewer = req.params.viewerUid

    const other = req.query.otherUser

    let conv = await Thread.find({ participants: { $all: [viewer, other] } })
    if(other) conv.receiver = await other

    // console.log(conv)
    return res.json(conv)
}

async function editMessage(req, res) {

}


module.exports = { sendMessage, getAllMessages, myMessages, getConversation }





// const Thread = require('../models/message'); // Assuming Message is a model defined as well
// const userSocketMap = new Map();

// // Send Message
// async function sendMessage(req, res) {
//     const sender = req.params.senderUid;
//     const { receiver, message, messageType } = req.body;

//     console.log('SENDER: ', sender);
//     console.log('RECEIVER: ', receiver);
//     console.log('MESSAGE: ', message);

//     let conversation;

//     // Check if the receiver is an array of users or a single user
//     if (Array.isArray(receiver)) {
//         conversation = await Thread.findOne({ participants: { $all: [sender, ...receiver] } });
//     } else {
//         conversation = await Thread.findOne({ participants: { $all: [sender, receiver] } });
//     }

//     // If no conversation found, create a new one
//     if (!conversation) {
//         if (Array.isArray(receiver)) {
//             conversation = await Thread.create({
//                 participants: [sender, ...receiver],
//                 message: []
//             });
//         } else {
//             conversation = await Thread.create({
//                 participants: [sender, receiver],
//                 message: []
//             });
//         }
//     }

//     // Save the new message to the conversation
//     conversation.message.push({
//         sender,
//         message,
//         messageType,
//         receiver
//     });

//     conversation.lastUpdated = Date.now();
//     await conversation.save();

//     // Find the recipient's socket ID and send the new message in real-time
//     const recipientSocketId = userSocketMap.get(receiver._id || receiver); // handle both single user or array of users
//     if (recipientSocketId) {
//         // Emit new message to recipient
//         io.to(recipientSocketId).emit('new_message', {
//             sender,
//             message,
//             messageType,
//             receiver,
//             messageType: 'received', // Mark this message as received for the recipient
//         });
//     }

//     // Find sender's socket ID and notify them with the sent message
//     const senderSocketId = userSocketMap.get(sender);
//     if (senderSocketId) {
//         // Emit message to sender
//         io.to(senderSocketId).emit('new_message', {
//             sender,
//             message,
//             messageType,
//             receiver,
//             messageType: 'sent', // Mark this message as sent for the sender
//         });
//     }

//     return res.json(conversation); // Return the updated conversation
// }

// // Fetch All Messages
// async function getAllMessages(req, res) {
//     const allMessages = await Thread.find({});
//     return res.json(allMessages);
// }

// // Fetch My Messages
// async function myMessages(req, res) {
//     const me = req.params.myUid;
//     const myMessages = await Thread.find({
//         participants: me
//     });
//     return res.json(myMessages);
// }

// // Fetch Conversation with Another User
// async function getConversation(req, res) {
//     const viewer = req.params.viewerUid;
//     const other = req.query.otherUser;

//     let conv = await Thread.find({ participants: { $all: [viewer, other] } });
//     return res.json(conv);
// }

// // Optional: Edit Message (not implemented here)
// async function editMessage(req, res) {
//     // Implementation for editing a message (if required)
// }

// module.exports = { sendMessage, getAllMessages, myMessages, getConversation };

const Thread = require('../models/message')

async function sendMessage(req,res) {
    const sender = req.params.sender
    const {receiver,message,messageType} = req.body

    console.log('SENDER: ',sender);
    console.log('RECEIVER: ',req.body);
    
    

    let conversation = await Thread.findOne({ participants : { $all : [sender,receiver] }  })

    if(!conversation){
        conversation = await Thread.create({
            participants : [sender,receiver],
            message : []
        })

    }
    
    conversation.message.push({
        sender,
        message,
        messageType
    })

    conversation.lastUpdated = Date.now()
    
    await conversation.save()

    return res.json(conversation)

}


module.exports = {sendMessage}

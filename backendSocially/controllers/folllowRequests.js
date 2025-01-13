const FollowRequest = require('../models/followRequests')
const User = require('../models/user')

async function showAllRequests(req, res) {
    const requests = await FollowRequest.find({})
    return res.json(requests)
}

async function sendRequest(req, res) {
    const senderName = req.params.name
    const receiverName = req.body.username

    const sender = await User.findOne({ username: senderName })
    const receiver = await User.findOne({ username: receiverName })

    console.log('SENDER IS: ',sender);
    console.log('RECEIVER IS: ',receiver);
    
    

    if(senderName === receiverName) return res.json({message : 'Invalid Request'})

    const existingRequest = await FollowRequest.findOne({
        fromUser: sender,
        toUser: receiver
    })

    if (existingRequest) return res.json({ message: "request already exists" })

    if (!sender || !receiver) return res.json({ message: "user not found" })

    const newRequest = await FollowRequest.create({
        fromUser: senderName,
        toUser: receiverName
    })

    return res.json(newRequest)
}

async function showMyRequests(req, res) {
    const userName = req.params.name

    const requests = (await FollowRequest.find({ toUser: userName, status: "pending" })).filter(request => request.fromUser !== userName)

    const fromUserNames = requests.map((request) => request.fromUser)

    const userRequests = await User.find({ username: { $in: fromUserNames } })
        .select('-_id username full_name profileImage bio website followers followings posts')
        .populate('profileImage')

    return res.json(userRequests)
}

async function showMyFollowers(req, res) {
    const username = req.params.name

    const acceptedRequests = await FollowRequest.find({ toUser: username, status: "accepted" })

    const followerNames = acceptedRequests.map(request => request.fromUser)

    const followerss = await User.find({ username: { $in: followerNames } })
        .select('-_id username full_name profileImage bio website followers followings posts')
        .populate('profileImage')

    return res.json(followerss)
}

async function showMyFollowing(req, res) {
    const holder = req.params.name

    const sentRequestAccepted = await FollowRequest.find({ fromUser: holder, status: 'accepted' })

    const followingsNames = sentRequestAccepted.map(request => request.toUser)

    const followings = await User.find({ username: { $in: followingsNames } })
        .select('-_id username full_name profileImage bio website followers followings posts')
        .populate('profileImage')
        .populate('posts','-accountHolderId')

    return res.json(followings)
}

async function acceptRequest(req, res) {
    const acceptor = req.params.name
    const requestor = req.body.username

    console.log('ACCEPTOR: ', acceptor);
    console.log('REQUESTOR: ', requestor);

    const reqUser = await FollowRequest.findOneAndUpdate(
        { fromUser: requestor, toUser: acceptor },
        { $set: { status: 'accepted' } },
        { new: true }
    )

    console.log('REQUIRED USER: ', reqUser);

    const existingFollower = await User.findOne(
        {
            username: acceptor,
            followers: { $in: requestor }
        }
    )

    if (existingFollower) console.log('EXISTING FOLLOWER: ', existingFollower)

    if (existingFollower) return res.json({ message: "follower already exists" })

    if (!reqUser) return res.json({ message: "there is no request found" })

    const userUpdate = await User.findOneAndUpdate(
        { username: acceptor },
        { $push: { followers: requestor } },
        { new: true }
    )

    console.log('UPDATED FOLLOWERS: ', userUpdate);


    const user2Update = await User.findOneAndUpdate(
        { username: requestor },
        { $push: { followings: acceptor } },
        { new: true }
    )

    console.log('UPDATED FOLLOWINGS: ', user2Update);


    return res.json(reqUser)
}

async function deleteRequest(req, res) {
    const deletor = req.params.name
    const beingdeleted = req.body.username

    console.log('deletor : ', deletor);
    console.log('being deleted: ', beingdeleted);

    const reqUser = await FollowRequest.findOneAndUpdate(
        { fromUser: beingdeleted, toUser: deletor },
        { $set: { status: 'rejected' } }
    )

    if (!reqUser) return res.json({ message: "could not find the user" })

    return res.json({ message: "request deleted successfully!" })
}

async function removeFromFollowers(req, res) {
    const remover = req.params.name
    const followerName = req.body.username

    console.log('REMOVER : ', remover);
    console.log('FOLLOWER NAME : ', followerName);

    const removeFromRequests = await FollowRequest.findOneAndUpdate(
        {
            fromUser: followerName,
            toUser: remover,
        },
        {
            $set: { status: 'rejected' }
        },
        {
            new: true
        }
    )

    if (!removeFromRequests) return res.json({ message: "no such follower exists" })
    console.log('THE REQUEST BEING REMOVED: ', removeFromRequests);

    const updatedUser = await User.findOneAndUpdate(
        {
            username: remover
        },
        {
            $pull: { followers: followerName }
        },
        {
            new: true
        }
    )

    console.log('UPDATED USER WHEN FOLLOWER REMOVED: ',updatedUser);

    const updatedUser2 = await User.findOneAndUpdate(
        {
            username: followerName
        },
        {
            $pull:
            {
                followings: remover
            }
        },
        {
            new: true
        }
    )

    console.log('UPDATED USER 2 WHEN FOLLOWER REMOVED: ',updatedUser);

    removeRejectedRequests()

    return res.json(removeFromRequests)
}

async function removeFromFollowings(req, res) {
    let remover = ''
    if (req.params.name) remover = req.params.name
    const followingName = req.body.username

    const removeFollowing = await FollowRequest.findOneAndUpdate(
        {
            fromUser: remover,
            toUser: followingName,
        },
        {
            $set:
            {
                status: 'rejected'
            }
        },
        {
            new: true
        }
    )

    if (!removeFollowing) return res.json({ message: 'no such user exists' })

    const updatedUser = await User.findOneAndUpdate(
        {
            username: remover
        },
        {
            $pull:
            {
                followings: followingName
            }
        }
    )

    console.log('UPDATED USER AFTER REMOVING FOLLOWING: ',updatedUser);

    const  updatedUser2 = await User.findOneAndUpdate(
        {
            username : followingName
        },
        {
            $pull : 
            {
                followers: remover
            }
        }
    )

    console.log('UPDATED USER 2 AFTER REMOVING FOLLOWING: ',updatedUser2);
    

    removeRejectedRequests()

    return res.json(removeFollowing)
}

async function removeRejectedRequests() {

    const rejectedReq = await FollowRequest.find({status : 'rejected'})

    if(rejectedReq) await FollowRequest.deleteMany({rejectedReq})


    // console.log('DELETE COUNT: ', rejectedRequests.deletedCount);

}


module.exports = { sendRequest, showMyRequests, acceptRequest, showAllRequests, showMyFollowers, showMyFollowing, deleteRequest, removeRejectedRequests, removeFromFollowers, removeFromFollowings }
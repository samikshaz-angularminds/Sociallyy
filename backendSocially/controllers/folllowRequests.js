const FollowRequest = require('../models/followRequests')
const User = require('../models/user')

async function showAllRequests(req, res) {
    const requests = await FollowRequest.find({})
    return res.json(requests)
}

async function sendRequest(req, res) {
    const senderUid = req.params.senderUid
    const receiverUid = req.body.myUid

    console.log('SENDER id IS: ', senderUid);
    console.log('RECEIVER id IS: ', receiverUid);

    const sender = await User.findOne({ id: senderUid })
    const receiver = await User.findOne({ id: receiverUid })

    console.log('SENDER IS: ', sender);
    console.log('RECEIVER IS: ', receiver);

    if (senderUid === receiverUid) return res.json({ message: 'Invalid Request' })

    const existingRequest = await FollowRequest.findOne({
        fromUser: senderUid,
        toUser: receiverUid
    })

    if (existingRequest) return res.json({ message: "request already exists" })

    if (!sender || !receiver) return res.json({ message: "user not found" })

    const newRequest = await FollowRequest.create({
        fromUser: senderUid,
        toUser: receiverUid
    })

    return res.json(newRequest)
}

async function showMyRequests(req, res) {
    const myUid = req.params.myUid

    const requests = (await FollowRequest.find({ toUser: myUid, status: "pending" })).filter(request => request.fromUser !== myUid)

    const fromUserIds = requests.map((request) => request.fromUser)

    const userRequests = await User.find({ id: { $in: fromUserIds } })
        .select('-_id id username full_name profileImage bio website followers followings posts')
        .populate('profileImage')

    return res.json(userRequests)
}

async function showMyFollowers(req, res) {
    const myUid = req.params.myUid

    console.log('my uid: ',myUid);
    

    const acceptedRequests = await FollowRequest.find({ toUser: myUid, status: "accepted" })

    console.log('accepted requets: ',acceptedRequests);
    

    const followerUids = acceptedRequests.map(request => request.fromUser)

    const followerss = await User.find({ id: { $in: followerUids } })
        .select('-_id id username full_name profileImage bio website followers followings posts')
        .populate('profileImage')

    return res.json(followerss)
}

async function showMyFollowing(req, res) {
    const myUid = req.params.myUid

    const sentRequestAccepted = await FollowRequest.find({ fromUser: myUid, status: 'accepted' })

    const followingUids = sentRequestAccepted.map(request => request.toUser)

    const followings = await User.find({ id: { $in: followingUids } })
        .select('-_id username full_name profileImage bio website followers followings posts')
        .populate('profileImage')
        .populate('posts', '-accountHolderId')

    return res.json(followings)
}

async function acceptRequest(req, res) {
    const acceptorUid = req.params.acceptorUid
    const requestorUid = req.body.requestorUid

    console.log('ACCEPTOR: ', acceptorUid);
    console.log('REQUESTOR: ', requestorUid);

    const reqUser = await FollowRequest.findOneAndUpdate(
        { fromUser: requestorUid, toUser: acceptorUid },
        { $set: { status: 'accepted' } },
        { new: true }
    )

    console.log('REQUIRED USER: ', reqUser);

    const existingFollower = await User.findOne(
        {
            id: acceptorUid,
            followers: { $in: requestorUid }
        }
    )

    if (existingFollower) console.log('EXISTING FOLLOWER: ', existingFollower)

    if (existingFollower) return res.json({ message: "follower already exists" })

    if (!reqUser) return res.json({ message: "there is no request found" })

    const userUpdate = await User.findOneAndUpdate(
        { id: acceptorUid },
        { $push: { followers: requestorUid } },
        { new: true }
    )

    console.log('UPDATED FOLLOWERS: ', userUpdate);


    const user2Update = await User.findOneAndUpdate(
        { id: requestorUid },
        { $push: { followings: acceptorUid } },
        { new: true }
    )

    console.log('UPDATED FOLLOWINGS: ', user2Update);


    return res.json(reqUser)
}

async function deleteRequest(req, res) {
    const deletor = req.params.myUid
    const beingdeleted = req.body.deletingUid

    // console.log('deletor : ', deletor);
    // console.log('being deleted: ', beingdeleted);

    const reqUser = await FollowRequest.findOneAndUpdate(
        { fromUser: beingdeleted, toUser: deletor },
        { $set: { status: 'rejected' } },
        { new: true }
    )

    if (!reqUser) return res.json({ message: "could not find the user" })

    await removeRejectedRequests()

    return res.json({ message: "request deleted successfully!" })
}

async function pendingRequests(req, res) {
    const requestor = req.params.myUid

    const requests = await FollowRequest.find({ fromUser: requestor, status: 'pending' })

    return res.json(requests)
}

async function removeFromFollowers(req, res) {
    const remover = req.params.myUid
    const followerName = req.body.removingUid

    // console.log('REMOVER : ', remover);
    // console.log('FOLLOWER NAME : ', followerName);

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
    // console.log('THE REQUEST BEING REMOVED: ', removeFromRequests);

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

    // console.log('UPDATED USER WHEN FOLLOWER REMOVED: ', updatedUser);

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

    // console.log('UPDATED USER 2 WHEN FOLLOWER REMOVED: ', updatedUser2);

    await removeRejectedRequests()

    return res.json(removeFromRequests)
}

async function removeFromFollowings(req, res) {
    const remover = req.params.myUid
    const followingName = req.body.removingUid

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
            id: remover
        },
        {
            $pull:
            {
                followings: followingName
            }
        },
        {
            new : true
        }
    )

    // console.log('UPDATED USER AFTER REMOVING FOLLOWING: ', updatedUser);

    const updatedUser2 = await User.findOneAndUpdate(
        {
            id: followingName
        },
        {
            $pull:
            {
                followers: remover
            }
        },
        {
            new : true
        }
    )

    // console.log('UPDATED USER 2 AFTER REMOVING FOLLOWING: ', updatedUser2);


    await removeRejectedRequests()

    return res.json(removeFollowing)
}

async function requestSuggestions(req,res) {
    const myUid = req.params.myUid

    const myRequests = await FollowRequest.find({ fromUser:myUid })

    let toUsers = myRequests.map(request => request.toUser)

    toUsers.push(myUid)

    const suggestions = await User.find({ id : {$nin : toUsers} })
    .select('-_id id username full_name profileImage bio website followers followings posts')
    .populate('profileImage')

    return res.json(suggestions)
}

async function removeRejectedRequests() {

    const rejectedReq = await FollowRequest.find({ status: 'rejected' })

    console.log('REJECTED REQUEST: ',rejectedReq);
    

    if (rejectedReq.length > 1){

        const rejectedIds = rejectedReq.map(req => req._id)

        await FollowRequest.deleteMany({ _id : { $in : rejectedIds} })
    } 
        

}


module.exports = { sendRequest, showMyRequests, requestSuggestions,acceptRequest, pendingRequests, showAllRequests, showMyFollowers, showMyFollowing, deleteRequest, removeRejectedRequests, removeFromFollowers, removeFromFollowings }
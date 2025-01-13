const User = require('../models/user')
const ProfilePhoto = require('../models/uploadPhoto')
const { setUser, getUser } = require('../services/authLogin')
const { cloudinary } = require('../config/cloudinaryConfig')
const { default: mongoose } = require('mongoose')
require('dotenv').config()

async function uploadImage(filePath) {
    try {
        const response = await cloudinary.uploader.upload(filePath)

        const newProfilePic = await ProfilePhoto.create({
            public_id: response.public_id,
            url: response.url
        })

        return newProfilePic
    } catch (error) {
        console.log('ERROR HEREEEEEEEEEEEEE: ', error);
    }
}

async function registerUser(req, res) {
    const { id, username, email, password, full_name, bio, phone, website } = req.body
    const img = await uploadImage(req.file.path)

    const newUser = await User.create({
        id,
        username,
        email,
        password,
        full_name,
        bio,
        phone,
        website,
        profileImage: img
    })

    return res.json(newUser)

}

async function loginUser(req, res) {
    const { email, password } = req.body

    console.log('EMAIL:::  ', email);
    console.log('PASSWORD::: ', password);


    const requiredUser = await User.findOne({ email, password })

    console.log('REQUIRED USER: ', requiredUser);


    if (!requiredUser)
        return res.status(400).json({ message: "no user found" })

    
    const token = setUser(requiredUser)
    res.cookie("uid", token, {
        httpOnly: true,
        secure: false,

    })

    console.log('TOKEN HERE: ', token);

    return res.json({ user: requiredUser, token: token })
}

async function getAllUsers(req, res) {

    const allusers = await User.find({})

    return res.json(allusers)
}

async function getUsersForSearching(req, res) {
    const users = await User.find({})
        .select('-_id username full_name profileImage bio website followers followings posts isPrivate')
        .populate('profileImage')
        .populate('posts','-accountHolderId')

    return res.json(users)
}

async function getUsersExceptMe(req, res) {
    const userId = req.params.id
    const userObjectId = new mongoose.Types.ObjectId(userId)
    console.log('IS IT VALID? ', mongoose.isValidObjectId(userId));
    console.log('USER OBJECT ID: ', userObjectId);
    console.log('USER ID: ', userId);

    const allUsers = await User.find({ _id: { $ne: userObjectId } })
        .select('username full_name profileImage bio website followers followings posts')
        .populate('profileImage')


    return res.json(allUsers)
}

async function getOneUser(req, res) {
    const userId = req.params.id

    const user = await User.findById(userId).populate('profileImage')

    return res.json(user)
}

async function seeAnotherUser(req, res) {
    const username = req.params.name

    const user = await User.findOne({ username: username })
        .select('-_id username full_name profileImage bio website followers followings posts isPrivate')
        .populate('profileImage')
        .populate('posts', '-accountHolderId')

    return res.json(user)

}

async function privateAccount(req, res) {
    const userId = req.params.userId
    const command = req.body.command

    if (command === 'true') {
        const userPrivate = await User.findByIdAndUpdate(userId,
            {
                $set: { isPrivate: true }
            },
            { new: true }
        )

        return res.json(userPrivate)
    }
    else if (command === 'false') {
        const userPublic = await User.findByIdAndUpdate(userId,
            {
                $set: { isPrivate: false }
            },
            { new: true }
        )
        return res.json(userPublic)
    }

    return res.json({ message: 'bham bham bhole' })
}

async function deleteAccount(req, res) {
    const userId = req.params.userId

    const deleteUser = await User.findByIdAndDelete(userId)

    if (!deleteUser) return res.json({ message: 'could not delete an user' })

    return res.json({ message: 'User deleted successfully!' })
}

module.exports = { registerUser, getAllUsers, getUsersForSearching, uploadImage, loginUser, getOneUser, getUsersExceptMe, seeAnotherUser, privateAccount, deleteAccount }
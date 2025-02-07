const User = require('../models/user')
const OTP = require('../models/otp')
const ProfilePhoto = require('../models/uploadPhoto')
const { setUser, getUser } = require('../services/authLogin')
const { cloudinary } = require('../config/cloudinaryConfig')
const { default: mongoose } = require('mongoose')
require('dotenv').config()
const nodemailer = require('nodemailer')
const crypto = require('crypto');
const { text } = require('express')
const { error } = require('console')
const httpStatus = require('http-status')
const { type } = require('os')
const path = require('path');

async function uploadImage(filePath) {
    console.log('file path here: ', filePath);

    try {
        console.log('FILE PATH: ', filePath);

        const response = await cloudinary.uploader.upload(filePath)

        const newProfilePic = await ProfilePhoto.create({
            public_id: response.public_id,
            url: response.url
        })

        console.log('NEW PROFILE PIC: ', newProfilePic);

        return newProfilePic
    } catch (error) {
        console.log('ERROR HEREEEEEEEEEEEEE: ', error);
    }
}

async function updateProfilePic(req, res) {
    const userId = req.params.userId
    const profilePic = await uploadImage(req.file?.path)

    const newPic = await User.findByIdAndUpdate(userId,
        {
            $set: {
                profileImage: profilePic
            }
        },
        {
            new: true
        }
    )

    return res.json(newPic)
}

async function registerUser(req, res) {
    const { id, username, email, password, full_name, bio, phone, website } = req.body
    console.log('REQUEST BODY:: ', req.body);

    console.log('REGISTER FILLE: ', req.file);
    console.log('REG FILE PATH: ', req.file?.path);

    let img;
    if (!req.file) {
        img = await uploadImage('data:image/png;base64,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');
    }
    else {

        img = await uploadImage(req.file?.path)
    }


    console.log('IMGGGGGG: ', img);


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

async function updateUser(req, res) {
    const userid = req.params.userId
    const { username, email, password, full_name, bio, phone, website } = req.body
    const profilePic = await uploadImage(req.file?.path)


    const user = await User.findByIdAndUpdate(userid,
        {
            $set: {
                username: username,
                email: email,
                full_name: full_name,
                bio: bio,
                phone: phone,
                website: website,
                profileImage: profilePic
            }
        },
        {
            new: true
        }
    )

    console.log(user);

    return res.json(user)

}

async function loginUser(req, res) {
    const { email, password } = req.body

    console.log('EMAIL:::  ', email);
    console.log('PASSWORD::: ', password);


    const requiredUser = await User.findOne({ email, password })

    // console.log('REQUIRED USER: ', requiredUser);


    if (!requiredUser)
        return res.status(400).json({ message: "no user found" })


    const token = setUser(requiredUser)
    res.cookie("uid", token, {
        httpOnly: true,
        secure: false,
    })

    // console.log('TOKEN HERE: ', token);

    return res.json({ user: requiredUser, token: token })
}

async function sendOtp(req, res) {
    const email = req.body.email;
    const otp = crypto.randomInt(100000, 999999);

    const user = await User.find({ email: email });

    if (!user) return res.status(httpStatus.NOT_FOUND);

    await OTP.findOneAndUpdate(
        { email },
        { otp, expiresAt: Date.now() + 5 * 60 * 1000,type:'forgot-password'},
        { upsert: true, new: true }
    )

    let transpoter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: `${process.env.NODEMAILER_EMAIL}`,
            pass: `${process.env.NODEMAILER_PASSKEY}`
        }
    })

    let mailOptions = {
        from: `${process.env.NODEMAILER_EMAIL}`,
        to: `${email}`,
        subject: 'Your OTP for Verification',
        text: `Dear Customer,

        Your One-Time Password (OTP) for verification is: ${otp}

        This OTP is valid for [X] minutes. Please do not share it with anyone.

        If you did not request this, please ignore this email.`
    }

    transpoter.sendMail(mailOptions, (error, info) => {
        if (error) console.log('Error sending email: ', error);
        else console.log('Email sent: ', info.response);
    })

    return res.json({ message: "mail sent successfully!" })
}

async function verifyOtp(req, res) {
    const { email, otp } = req.body;
    console.log('email: ',email);
    console.log('otp: ',otp);

    const requiredOtpDoc = await OTP.findOne({ email: email });

    console.log('requiredOtpDoc: ',requiredOtpDoc);
    

    if (!requiredOtpDoc) return res.status(404);

    console.log('otp exp date: ',requiredOtpDoc.expiresAt);
    console.log('now date: ',new Date());
    
    if (requiredOtpDoc.expiresAt.getTime() < new Date()) return res.status(400).json({ error: 'OTP Expired' });

    const otpMatch = requiredOtpDoc.otp == otp;
    console.log('otpMatch: ',otpMatch);
    

    if (otpMatch) {
        const requiredUser = await User.findOne({email:email})
        req.body = {email:requiredUser.email,password:requiredUser.password}
        return loginUser(req,res);

    }

    return res.status(400);
}

async function loginByOtp(req,res) {
     
}

async function getAllUsers(req, res) {

    const allusers = await User.find({})

    return res.json(allusers)
}

async function getUsersForSearching(req, res) {
    const users = await User.find({})
        .select('-_id id username full_name profileImage bio website followers followings posts isPrivate')
        .populate('profileImage')
        .populate('posts', '-accountHolderId')

    return res.json(users)
}

async function getUsersExceptMe(req, res) {
    console.log('hiiiiiii');

    const userId = req.params.id
    const userObjectId = new mongoose.Types.ObjectId(userId)
    console.log('IS IT VALID? ', mongoose.isValidObjectId(userId));
    console.log('USER OBJECT ID: ', userObjectId);
    console.log('USER ID: ', userId);

    const allUsers = await User.find({ _id: { $ne: userObjectId } })
        .select('id username full_name profileImage bio website followers followings posts')
        .populate('profileImage')

    console.log('alllllllllll: ', allUsers);

    return res.json(allUsers)
}

async function getOneUser(req, res) {
    const userId = req.params.id

    const user = await User.findById(userId).populate('profileImage')

    return res.json(user)
}

async function seeAnotherUser(req, res) {
    try {
        const uid = req.query.uid;
        const viewerUid = req.query.viewerUid;
        // console.log('JISKI PROFILE DEKHNI HAI: ', uid);
        console.log('LOGGED IN USER IS: ', viewerUid);

        const user = await User.findOne({ id: uid })
            .select('-_id id username full_name profileImage bio website followers followings posts isPrivate')
            .populate('profileImage')
            .populate('posts', '-accountHolderId')

        // console.log('USER: ',user);


        // console.log('IS ACCOUNT PRIVATE? ', user.isPrivate);
        // console.log('IS VIEWER IN THE FOLLOWER? ', user.followers.includes(viewer));

        if (user.isPrivate && (!user.followers.includes(viewerUid))) {
            const updatedUser = {
                username: user.username,
                full_name: user.full_name,
                profileImage: user.profileImage,
                bio: user.bio,
                website: user.website,
                followersCount: user.followers.length,
                followingsCount: user.followings.length,
                postsCount: user.posts.length,
                isPrivate: user.isPrivate,
            }

            // console.log('UPDATED ONE: ', updatedUser);

            return res.json(updatedUser)
        }

        return res.json(user)
    } catch (error) {
        console.error('Error in seeAnotherUser:', error);
        return res.status(500).json({ error: 'An error occurred' });
    }
}

async function privateAccount(req, res) {
    const userId = req.params.userId
    const command = req.body.command

    // console.log('USER ID: ', userId);
    // console.log('COMMAND: ', command);

    if (command === true) {
        const userPrivate = await User.findByIdAndUpdate(userId,
            {
                $set: { isPrivate: true }
            },
            { new: true }
        )

        console.log('USER PRIVATE: ', userPrivate);


        return res.json(userPrivate)
    }
    else {
        const userPublic = await User.findByIdAndUpdate(userId,
            {
                $set: { isPrivate: false }
            },
            { new: true }
        )

        console.log('USER PUBLIC: ', userPublic);


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

async function downloadPic(req,res) {
    const filename = req.params.filename;
    const filePath = path.join(__dirname,"../downloads");

    res.download(filePath,filename,(err)=>{
        console.log('an error has occured during downloading... ',err);
    })
}

module.exports = {
    registerUser,
    updateUser, 
    getAllUsers, 
    sendOtp, 
    verifyOtp, 
    getUsersForSearching, 
    uploadImage, 
    updateProfilePic, 
    loginUser, 
    getOneUser, 
    getUsersExceptMe, 
    seeAnotherUser, 
    privateAccount, 
    deleteAccount,
    downloadPic
}
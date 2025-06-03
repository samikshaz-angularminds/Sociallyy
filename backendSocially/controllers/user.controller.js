const User = require('../models/user.model');
const OTP = require('../models/otp.model');
const ProfilePhoto = require('../models/uploadPhoto.model');
const { cloudinary } = require('../config/cloudinaryConfig');
const { default: mongoose } = require('mongoose');
require('dotenv').config();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const httpStatus = require('http-status');
const path = require('path');
const fs = require('fs');
const { asyncErrorHandler } = require('../utils/asyncErrorHandle.utils');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const {ApiError} = require("../utils/ApiError.utils")

const options = {
    httpOnly: true,
    secure: false
};

const generateAccessAndRefreshTokens = async (userId) => {

    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        console.log('accesstoken: ', accessToken);
        console.log('refreshtoken: ', refreshToken);



        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.log("error occurred during generation of tokens");
    }
};

const refreshAccessToken = asyncErrorHandler(async (req, res) => {
    const refreshTokenFromUser = req.cookies?.refreshToken || req.body?.refreshToken;



    if (!refreshTokenFromUser) return res.status(401)

    console.log('REFRESH TOKEN FROM USER IS: ', refreshTokenFromUser);
    console.log();
    

    try {
        const decodedToken = jwt.verify(refreshTokenFromUser, process.env.REFRESH_TOKEN_SECRET);

        console.log('DECODED TOKEN IN REFRESHING...',decodedToken);
        console.log();
        
        
        const user = await User.findById(decodedToken._id);

        console.log('FOUNDED USER: ',user);
        console.log();
        
        

        if (!user) return res.status(401).json({ error: "invalid refresh token" })

        if (refreshTokenFromUser !== user?.refreshToken) {
            return res.status(401).json({ error: "refresh token is expired or used" });
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

        console.log('ACCESS TOKEN: ',accessToken);
        console.log();
        
        console.log('REFRESH TOKEN: ',newRefreshToken);
        console.log();
        

        return res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json({ message: "access token has been refreshed successfully!!" });

    } catch (error) {
        console.log("error while refreshing the access token");

    }
});

const uploadImage = asyncErrorHandler(async function (filePath) {
    console.log('FILE PATH: ', filePath);



    const response = await cloudinary.uploader.upload(filePath, {
        folder: "Socially"
    })

    console.log("UPLOAD RESPONSE: ", response);
    const newProfilePic = await ProfilePhoto.create({
        public_id: response.public_id,
        url: response.url
    })

    console.log('NEW PROFILE PIC: ', newProfilePic);

    return newProfilePic

});

const updateProfilePic = asyncErrorHandler(async function (req, res) {
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

    return res
        .status(200)
        .json(
            new apire
        )
});

const registerUser = asyncErrorHandler(async  (req, res) => {
    const { id, username, email, password, full_name, bio, phone, website } = req.body
    console.log('REQUEST BODY:: ', req.body);

    console.log('REGISTER FILLE: ', req.file);
    console.log('REG FILE PATH: ', req.file?.path);

    let img;
    if (!req.file) {
        img = uploadImage('data:image/png;base64,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');
    }
    else {
        img = uploadImage(req.file?.path)
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
    });

    if(!newUser){
        throw new ApiError(400, "Failed to create the user");
    }

    return res.json(newUser);

});

const updateUser = asyncErrorHandler(async function (req, res) {
    const userid = req.params.userId
    const { username, email, password, full_name, bio, phone, website } = req.body
    const profilePic = uploadImage(req.file?.path)


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

});

const loginUser = asyncErrorHandler(async function (req, res) {
    const { emailorusername, password } = req.body


    const user = await User.findOne({
        $or: [{ username: emailorusername }, { email: emailorusername }]
    })

    if (!user){
        throw new ApiError(404, "User not found");
    }
        
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    console.log('ACCESS TOKEN HERE: ', accessToken);
    console.log();
    console.log('REFRESH TOKEN HERE: ', refreshToken);
    console.log();
    console.log({user, token:accessToken});
    console.log();

    return res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ user, token: accessToken });
});

const logOutUser = asyncErrorHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        { new: true }
    );

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({ message: "User logged out successfully" });
});

const sendOtp = asyncErrorHandler(async function (req, res) {
    const email = req.body.email;
    const otp = crypto.randomInt(100000, 999999);

    const user = await User.find({ email: email });

    if (!user) return res.status(httpStatus.NOT_FOUND);

    await OTP.findOneAndUpdate(
        { email },
        { otp, expiresAt: Date.now() + 5 * 60 * 1000, type: 'forgot-password' },
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
});

const verifyOtp = asyncErrorHandler(async function (req, res) {
    const { email, otp } = req.body;
    console.log('email: ', email);
    console.log('otp: ', otp);

    const requiredOtpDoc = await OTP.findOne({ email: email });

    console.log('requiredOtpDoc: ', requiredOtpDoc);


    if (!requiredOtpDoc) return res.status(404);

    console.log('otp exp date: ', requiredOtpDoc.expiresAt);
    console.log('now date: ', new Date());

    if (requiredOtpDoc.expiresAt.getTime() < new Date()) return res.status(400).json({ error: 'OTP Expired' });

    const otpMatch = requiredOtpDoc.otp == otp;
    console.log('otpMatch: ', otpMatch);


    if (otpMatch) {
        const requiredUser = await User.findOne({ email: email })
        req.body = { email: requiredUser.email, password: requiredUser.password }
        return loginUser(req, res);

    }

    return res.status(400);
});

const getAllUsers = asyncErrorHandler(async function (req, res) {

    const allusers = await User.find({})

    if(!allusers){
        throw new ApiError(404,"users not found");
    }

    return res.json(allusers)
});

const getUsersForSearching = asyncErrorHandler(async function (req, res) {
    const users = await User.find({})
        .select('-_id id username full_name profileImage bio website followers followings posts isPrivate')
        .populate('profileImage')
        .populate('posts', '-accountHolderId')

    return res.json(users)
});

const getUsersExceptMe = asyncErrorHandler(async function (req, res) {
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
});

const getOneUser = asyncErrorHandler(async function (req, res) {
    const userId = req.params.id;

    console.log("USER ID: ",userId);
    

    const user = await User.findById(userId).populate('profileImage');
    console.log("USER FOUND: ",user);


    if(!user){
        throw new ApiError(404, "User not found");
    }

    return res.json(user);
});

const seeAnotherUser = asyncErrorHandler(async function (req, res) {
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
});

const privateAccount = asyncErrorHandler(async function (req, res) {
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
});

const deleteAccount = asyncErrorHandler(async function (req, res) {
    const userId = req.params.userId

    const deleteUser = await User.findByIdAndDelete(userId)

    if (!deleteUser) return res.json({ message: 'could not delete an user' })

    return res.json({ message: 'User deleted successfully!' })
});

const downloadPic = asyncErrorHandler(async function (req, res) {

    const downloadingFile = req.query.fileUrl;
    const fileElementsArray = downloadingFile.split('/');
    const filename = fileElementsArray[fileElementsArray.length - 1];

    console.log('downloading file: ', downloadingFile);


    if (!downloadingFile || !downloadingFile.startsWith("http")) {
        return res.status(400).json({ error: "invalid file url" });
    }

    // const downloadPath = path.resolve(__dirname, '../../../../../Downloads', filename);
    // const writer = fs.createWriteStream(downloadPath);

    try {
        const response = await axios({
            method: "GET",
            url: downloadingFile,
            responseType: "stream"
        });

        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Type", response.headers["content-type"] || "application/octet-stream");
        res.setHeader("Content-Length", response.headers["content-length"]);
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
        response.data.pipe(res);

        response.data.on("end", () => {
            console.log("Download completed:", filename);
        });

        response.data.on("error", (err) => {
            console.error("Error during file streaming:", err);
            res.status(500).json({ error: "Error downloading file" });
        });
    } catch (error) {
        console.log('error occured while downloading the file..', error);
    }



    // return new Promise((resolve, reject) => {
    //     writer.on("finish", resolve);
    //     writer.on("error", reject);
    // });
});

module.exports = {
    registerUser, // working
    updateUser,
    getAllUsers,
    sendOtp,
    verifyOtp,
    getUsersForSearching,
    uploadImage,
    updateProfilePic,
    loginUser, // working
    getOneUser, // working
    getUsersExceptMe,
    seeAnotherUser,
    privateAccount,
    deleteAccount,
    downloadPic,
    refreshAccessToken,
    logOutUser
}
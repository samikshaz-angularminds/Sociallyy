const Post = require('../models/uploadPosts.model')
const { cloudinary } = require('../config/cloudinaryConfig');
const User = require('../models/user.model');
const { asyncErrorHandler } = require('../utils/asyncErrorHandle.utils');


// for below line we need type:module in package.json
// import path from 'path';
const uploadPostPhotos = asyncErrorHandler( async function (files) {

    console.log('files in post: ', files);

    filePaths = files.map(file => file.path)

    const mediaArray = await Promise?.all(
        filePaths.map(async (filepath) => {
            const response = await cloudinary.uploader.upload(filepath);
            return {
                public_id: response.public_id,
                url: response.url
            };
        })
    );

    console.log('MEDIA ARRAY: ', mediaArray);

    return mediaArray
});

const uploadPost = asyncErrorHandler( async function (req, res) {
    const userId = req.params.userId

    console.log('FILESS: ', req.files);


    const mediaArray = await uploadPostPhotos(req.files)
    console.log('post images: ', mediaArray);


    const { caption, accountHolderName } = req.body

    const newPost = await Post.create({
        caption,
        accountHolderName,
        media: mediaArray,
        accountHolderId: userId
    })

    const userUpdate = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { posts: newPost._id } },
        { new: true }
    )

    console.log('NEW POST: ', newPost);
    console.log('UPDATED USER: ', userUpdate);


    return res.json(newPost)

});

const updatePost = asyncErrorHandler( async function (params) {

});

const showAllPosts = asyncErrorHandler( async function (req, res) {
    const allPosts = await Post.find({}).populate('accountHolderId', '-id -_id')

    return res.json(allPosts)
});

const filteredPosts = asyncErrorHandler( async function (req, res) {
    const username = req.params.username

    const allPosts = await Post.find({}).populate('accountHolderId', '-password')


    const filteredPosts = allPosts.filter(post => {
        const account = post.accountHolderId

        console.log('ACCOUNTS:: ', account);

        if (!account.isPrivate) {
            return true
        }

        return account.followers.includes(username)


    })

    return res.json({ filteredPosts })
});

const showMyPosts = asyncErrorHandler( async function (req, res) {
    const userId = req.params.userId

    const posts = await Post.find({ accountHolderId: userId })

    // console.log('MY POSTS: ', posts);
    return res.json(posts)
});

const deletePost = asyncErrorHandler( async function (req, res) {
    const postId = req.params.postId

    const postToBeDeleted = await Post.findByIdAndDelete(postId)

    if (!postToBeDeleted) return res.json({ message: "no such post found" })

    const updateUser = await User.findOneAndUpdate(
        { _id: postToBeDeleted.accountHolderId },
        { $pull: { posts: postId } }
    )

    console.log('UPDATED USER AFTER DELETING A POST: ', updateUser);


    return res.json({ message: "post deleted successfully" })
});

const showOnePost = asyncErrorHandler( async function (req, res) {
    const postId = req.params.postId

    const post = await Post.findById(postId)

    return res.json(post)
});

const likedAPost= asyncErrorHandler( async function (req, res) {
    const postId = req.params.postId

    const { liker } = req.body

    console.log('LIKER: ', liker);
    const existingLike = await Post.findOne(
        {
            _id: postId,
            likes: { $in: liker }
        }
    )

    if (existingLike) return res.json({ message: 'already liked' })

    const updatedPost = await Post.findOneAndUpdate(
        {
            _id: postId
        },
        {
            $push: { likes: liker }
        },
        {
            new: true
        }
    )

    console.log('UPDATED POST: ', updatedPost);

    return res.json(updatedPost)

});

const unLikeAPost = asyncErrorHandler( async function (req, res) {
    const postId = req.params.postId
    const { unliker } = req.body

    const updatedPost = await Post.findOneAndUpdate(
        {
            _id: postId
        },
        {
            $pull: { likes: unliker }
        }
    )

    console.log('UPDATED POST: ', updatedPost);

    return res.json(updatedPost)

});

const myPostLikers = asyncErrorHandler( async function (req, res) {
    const postid = req.params.postId

    const post = await Post.findById(postid).select('likes -_id')
    const likersNames = post?.likes || []
    console.log('likernames: ', likersNames);

    const likers = await User.find({ username: { $in: likersNames } })
        .select('-_id username full_name profileImage bio website followers followings posts')
        .populate('profileImage')

    console.log(likers);

    return res.json(likers)
});


module.exports = { 
    uploadPostPhotos, 
    uploadPost, 
    showMyPosts, 
    filteredPosts, 
    showAllPosts, 
    deletePost, 
    showOnePost, 
    likedAPost, 
    unLikeAPost, 
    myPostLikers }


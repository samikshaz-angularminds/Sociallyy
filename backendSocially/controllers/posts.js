const Post = require('../models/uploadPosts')
const { cloudinary } = require('../config/cloudinaryConfig');
const User = require('../models/user');
const { default: mongoose } = require('mongoose');

async function uploadPostPhotos(files) {

    console.log('files in post: ', files);

    filePaths = files.map(file => file.path)

    console.log(typeof Promise); // Should print "function"
    console.log(typeof Promise.all); // Should print "function"


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
}

async function uploadPost(req, res) {
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
        {
            _id: userId
        },
        {
            $push: { posts: newPost._id }
        },
        {
            new : true
        }
    )

    console.log('NEW POST: ', newPost);
    console.log('UPDATED USER: ', userUpdate);


    return res.json(newPost)

}

async function showAllPosts(req, res) {
    const allPosts = await Post.find({}).populate('accountHolderId','-id -_id')

    return res.json(allPosts)
}

async function filteredPosts(req,res) {
    const username = req.params.username

    const allPosts = await Post.find({}).populate('accountHolderId','-password')


    const filteredPosts = allPosts.filter(post => {
        // console.log('yayyy: ', post);

        const account = post.accountHolderId

        console.log('ACCOUNTS:: ', account);

        if (!account.isPrivate) {
            return true
        }

        return account.followers.includes(username)
        
        
    })

    return res.json({filteredPosts})
}

async function showMyPosts(req, res) {
    const userId = req.params.userId

    const posts = await Post.find({ accountHolderId: userId })

    // console.log('MY POSTS: ', posts);
    return res.json(posts)
}

async function deletePost(req, res) {
    const postId = req.params.postId

    const postToBeDeleted = await Post.findByIdAndDelete(postId)

    if (!postToBeDeleted) return res.json({ message: "no such post found" })

    const updateUser = await User.findOneAndUpdate(
        { _id: postToBeDeleted.accountHolderId },
        { $pull: { posts: postId } }
    )

    console.log('UPDATED USER AFTER DELETING A POST: ', updateUser);


    return res.json({ message: "post deleted successfully" })
}

async function editPost(req) {

}

async function showOnePost(req, res) {
    const postId = req.params.postId

    const post = await Post.findById(postId)

    return res.json(post)
}

async function likedAPost(req, res) {
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
            new : true
        }
    )

    console.log('UPDATED POST: ', updatedPost);

    return res.json(updatedPost)

}

async function unLikeAPost(req, res) {
   const postId = req.params.postId
   const {unliker} = req.body

    const updatedPost = await Post.findOneAndUpdate(
        {
            _id : postId
        },
        {
            $pull: { likes: unliker }
        }
    )

    console.log('UPDATED POST: ',updatedPost);
    
    return res.json(updatedPost)

}

module.exports = { uploadPostPhotos, uploadPost, showMyPosts, filteredPosts, showAllPosts, deletePost, showOnePost, likedAPost, unLikeAPost }


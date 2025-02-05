export const apiConstant = {
    API_HOST_URL : 'http://localhost:5005/',

    // USER
    USER_REGISTRATION : 'user/register',
    UPLOAD_PROFILE_PHOTO : 'user/uploadPhoto',
    USER_LOGIN : 'user/login',
    GET_ME : 'user/',
    GET_USERS_EXCEPT_ME : 'user/notme/',
    SHOW_ANOTHER_USER : 'user/other/user',
    DELETE_ACCOUNT : 'user/delete/',
    ACCOUNT_PRIVACY : 'user/privacy/',
    SEARCHLIST_USERS : 'user/search',
    UPDATE_PROFILE_PICTURE : 'user/updatePic/',
    UPDATE_USER : 'user/update/',
    SEND_OTP : 'user/sendotp',
    VERIFY_OTP : 'user/verifyotp',
    
    
    // REQUESTS
    SEND_REQUEST : 'requests/send/',
    MY_REQUESTS : 'requests/received/',
    ACCEPT_REQUEST : 'requests/accept/',
    DELETE_REQUEST : 'requests/delete/',
    SHOW_FOLLOWINGS : 'requests/followings/',
    SHOW_FOLLOWERS : 'requests/followers/',
    REMOVE_FOLLOWER : 'requests/removeFollower/',
    REMOVE_FOLLOWING : 'requests/removeFollowing/',
    DELETE_REJECTED_REQUESTS : 'requests/removeRejected',
    PENDING_REQUESTS : 'requests/pending/',
    SUGGESTIONS : 'requests/suggestions/',
    
    
    // POSTS
    POST : 'posts/uploadPost/',
    SHOW_MY_POSTS : 'posts/myPosts/',
    DELETE_POST : 'posts/delete/',
    SHOW_ONE_POST : 'posts/showOnePost/',
    LIKE_POST : 'posts/like/',
    UNLIKE_POST : 'posts/unlike/',
    POST_LIKESS : 'posts/myPostLikes/',

    // MESSAGES
    SEND_MESSAGE : 'message/send/',
    SHOW_MY_MESSAGES : 'message/myMessages/',
    SHOW_CONVERSATION : 'message/conv/'
}
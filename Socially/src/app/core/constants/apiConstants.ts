export const apiConstant = {
    // API_HOST_URL : 'https://sociallyy.onrender.com/',
    API_HOST_URL: 'http://localhost:5005/',

    // USER
    USER_REGISTRATION : 'api/user/register',
    UPLOAD_PROFILE_PHOTO : 'api/user/uploadPhoto',
    USER_LOGIN : 'api/user/login',
    GET_ME : 'api/user/',
    GET_USERS_EXCEPT_ME : 'api/user/notme/',
    SHOW_ANOTHER_USER : 'api/user/other/user',
    DELETE_ACCOUNT : 'api/user/delete/',
    ACCOUNT_PRIVACY : 'api/user/privacy/',
    SEARCHLIST_USERS : 'api/user/search',
    UPDATE_PROFILE_PICTURE : 'api/user/updatePic/',
    UPDATE_USER : 'api/user/update/',
    SEND_OTP : 'api/user/sendotp',
    VERIFY_OTP : 'api/user/verifyotp',
    DOWNLOAD_PROFILE_PIC : 'api/user/download/img',
    LOGOUT_USER : 'api/user/logout',
    REFRESH_ACCESS_TOKEN : 'api/user/refresh/refresh-token',

    
    
    // REQUESTS
    SEND_REQUEST : 'api/requests/send/',
    MY_REQUESTS : 'api/requests/received/',
    ACCEPT_REQUEST : 'api/requests/accept/',
    DELETE_REQUEST : 'api/requests/delete/',
    SHOW_FOLLOWINGS : 'api/requests/followings/',
    SHOW_FOLLOWERS : 'api/requests/followers/',
    REMOVE_FOLLOWER : 'api/requests/removeFollower/',
    REMOVE_FOLLOWING : 'api/requests/removeFollowing/',
    DELETE_REJECTED_REQUESTS : 'api/requests/removeRejected',
    PENDING_REQUESTS : 'api/requests/pending/',
    SUGGESTIONS : 'api/requests/suggestions/',
    
    
    // POSTS
    POST : 'api/posts/uploadPost/',
    SHOW_MY_POSTS : 'api/posts/myPosts/',
    DELETE_POST : 'api/posts/delete/',
    SHOW_ONE_POST : 'api/posts/showOnePost/',
    LIKE_POST : 'api/posts/like/',
    UNLIKE_POST : 'api/posts/unlike/',
    POST_LIKESS : 'api/posts/myPostLikes/',

    // MESSAGES
    SEND_MESSAGE : 'api/message/send/',
    SHOW_MY_MESSAGES : 'api/message/myMessages/',
    SHOW_CONVERSATION : 'api/message/conv/'
}
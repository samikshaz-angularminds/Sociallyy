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
    
    
    // POSTS
    POST : 'posts/uploadPost/',
    SHOW_MY_POSTS : 'posts/myPosts/',
    DELETE_POST : 'posts/delete/',
    SHOW_ONE_POST : 'posts/showOnePost/',
    LIKE_POST : 'posts/like/',
    UNLIKE_POST : 'posts/unlike/',
}
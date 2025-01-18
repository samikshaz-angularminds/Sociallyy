const jwt = require('jsonwebtoken')
const SECRET_WEB_KEY = 'MAINHOONGHATOTKCH'


function setUser(user) {
    return jwt.sign({
        _id : user._id.toString(),
        email : user.email,
        username : user.username,
        followings : user.followings,
        followers : user.followers,
        profileImage : user.profileImage,
        full_name : user.full_name,
    }, SECRET_WEB_KEY, {expiresIn:'1d'})
}

function getUser(req,res,next){

const token = req.header('Authorization')?.replace('Bearer ','')

    if(!token) return null
    const decodedToken = jwt.verify(token, SECRET_WEB_KEY)

    req.user = decodedToken
    next()
    
}


module.exports = {setUser,getUser}
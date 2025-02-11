const User = require("../models/user.model");
const {asyncErrorHandler} = require("../utils/asyncErrorHandle")
const jwt = require("jsonwebtoken");

const verifyJwt = asyncErrorHandler( async (req,res,next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
    console.log('token from verify: ', token);
    

    if(!token) return res.status(401).json({error: "unauthorized request"})

    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id);

    if(!user) return res.status(401).json("Invalid access token")

    req.user = user;
    console.log('req.user: ',req.user);
    
    next();
});

module.exports = verifyJwt
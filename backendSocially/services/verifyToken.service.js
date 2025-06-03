const User = require("../models/user.model");
const {ApiError}  = require("../utils/ApiError.utils");
const {asyncErrorHandler} = require("../utils/asyncErrorHandle.utils")
const jwt = require("jsonwebtoken");

const verifyJwt = asyncErrorHandler( async (req,res,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        console.log();
        console.log('token from verify: ', token);
        console.log();
        
        
    
        if(!token) {
            throw new ApiError(401,"There should be token");
        }
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken._id);
    
        if(!user) {
            throw new ApiError(401, "Invalid access token");
        }
    
        req.user = user;
        console.log('req.user: ',req.user);
        console.log();
        
        
        next();
    } catch (error) {
        if(error.name === "TokenExpiredError"){
            throw new ApiError(401, "Token has expired please refresh token");
        }

        if(error.name === "JsonWebTokenError"){
            throw new ApiError(401, "Invalid token");
        }

        return next(error);
    }
});

module.exports = verifyJwt
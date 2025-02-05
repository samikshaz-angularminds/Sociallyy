const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
    type : {type:String, enum:['verification','forgot-password']},
    email : {type:String, required:true},
    otp : {type:String, required:true},
    expiresAt: {type:Date,required:true}
});

const OTP = mongoose.model("otp",otpSchema);

module.exports = OTP;
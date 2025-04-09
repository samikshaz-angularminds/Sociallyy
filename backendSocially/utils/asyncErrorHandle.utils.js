const asyncErrorHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.log("error in error handler: ",err);
      
      return next(err)});
  }
    
    
    
//     requestHandler) =>{
//     return (req,res,next) => {
//         Promise.resolve(requestHandler(req,res,next).catch(err => next(err)) );
//     }
// };



module.exports = {asyncErrorHandler};
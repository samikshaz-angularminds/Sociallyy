const multer = require('multer')

const uploadStorage = multer.diskStorage({
    filename : function(req,file,cb){
       const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
       cb(null, uniqueName+'-'+file.originalname)
    }
})


const UploadPost = multer({storage : uploadStorage})

module.exports = UploadPost

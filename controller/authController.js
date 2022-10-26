const asyncHandler = require('express-async-handler');


module.exports = {
    signup : asyncHandler(async(req,res)=>{
        console.log(req.body);
    })
}
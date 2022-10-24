const errorHandler = (err,req,res,next)=>{
    console.log(err);
    let statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode).json({
        message : err.message,
        stack : process.env.NODE_ENV === 'development' ? err.stack : null
    })
}

module.exports  = {
    errorHandler
}